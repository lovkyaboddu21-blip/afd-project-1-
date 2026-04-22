from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import sqlite3
import os

app = FastAPI(title="CivicConnect API")

# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = "civic.db"

def get_db():
    conn = sqlite3.connect(DB_FILE, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    conn = sqlite3.connect(DB_FILE)
    conn.execute('''
        CREATE TABLE IF NOT EXISTS complaints (
            id TEXT PRIMARY KEY,
            title TEXT,
            category TEXT,
            severity TEXT,
            description TEXT,
            location TEXT,
            status TEXT,
            department TEXT,
            date TEXT,
            assignedTo TEXT
        )
    ''')
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# --- Pydantic Models ---

class ComplaintCreate(BaseModel):
    title: str
    category: str
    severity: str
    description: str
    location: str

class ComplaintResponse(ComplaintCreate):
    id: str
    status: str
    department: str
    date: str
    assignedTo: Optional[str] = None

class StatusUpdate(BaseModel):
    status: str

class AssignUpdate(BaseModel):
    assignedTo: Optional[str] = None
    
# --- Routes ---

@app.post("/api/complaints", response_model=ComplaintResponse)
def create_complaint(complaint: ComplaintCreate, db: sqlite3.Connection = Depends(get_db)):
    """Citizens use this to report a new issue."""
    # Generate ID and Timestamp
    complaint_id = f"C-2026-{datetime.now().strftime('%H%M%S')}"
    date_str = datetime.now().strftime("%b %d, %H:%M %p")
    status = "Pending"
    
    # Auto-assignment logic based on Category
    department = "General Municipal"
    if complaint.category in ["Water leakage", "Drain blockage", "Sewage"]:
        department = "Water Board"
    elif complaint.category in ["Potholes", "Road damage"]:
        department = "Public Works"
    elif complaint.category in ["Garbage", "Illegal dumping"]:
        department = "Sanitation"
    elif complaint.category in ["Broken streetlight", "Public safety hazard"]:
        department = "Power & Safety"

    db.execute('''
        INSERT INTO complaints (id, title, category, severity, description, location, status, department, date, assignedTo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        complaint_id, complaint.title, complaint.category, complaint.severity, 
        complaint.description, complaint.location, status, department, date_str, None
    ))
    db.commit()

    return {**complaint.dict(), "id": complaint_id, "status": status, "department": department, "date": date_str, "assignedTo": None}

@app.get("/api/complaints", response_model=List[ComplaintResponse])
def get_complaints(db: sqlite3.Connection = Depends(get_db)):
    """Used for Citizen and Admin dashboards to list all complaints."""
    cursor = db.execute('SELECT * FROM complaints ORDER BY date DESC')
    return [dict(row) for row in cursor.fetchall()]

@app.get("/api/complaints/{complaint_id}", response_model=ComplaintResponse)
def get_complaint(complaint_id: str, db: sqlite3.Connection = Depends(get_db)):
    """Get full details of a specific complaint."""
    cursor = db.execute('SELECT * FROM complaints WHERE id = ?', (complaint_id,))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return dict(row)

@app.patch("/api/complaints/{complaint_id}/status")
def update_status(complaint_id: str, payload: StatusUpdate, db: sqlite3.Connection = Depends(get_db)):
    """Admins/Staff use this to update the resolution status of an issue."""
    db.execute('UPDATE complaints SET status = ? WHERE id = ?', (payload.status, complaint_id))
    db.commit()
    return {"message": f"Complaint {complaint_id} updated to {payload.status}"}

@app.patch("/api/complaints/{complaint_id}/assign")
def update_assignee(complaint_id: str, payload: AssignUpdate, db: sqlite3.Connection = Depends(get_db)):
    """Admins use this to assign the complaint to a staff member."""
    db.execute('UPDATE complaints SET assignedTo = ? WHERE id = ?', (payload.assignedTo, complaint_id))
    db.commit()
    return {"message": f"Complaint {complaint_id} assigned to {payload.assignedTo}"}

if __name__ == "__main__":
    import uvicorn
    # Make sure to run this using: uvicorn main:app --reload
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
