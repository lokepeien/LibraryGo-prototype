const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- IN-MEMORY DATABASE STATE ---

let seats = [
  { id: 'L1-S01', area: 'Level 1: Collaborative Zone', nfcUid: '04:A2:3E:9B:10:E2:80', status: 'Booked', occupant: 'Ahmad Faiz (A22CS0148)' },
  { id: 'L1-S02', area: 'Level 1: Collaborative Zone', nfcUid: '04:5C:8B:1A:F5:2C:81', status: 'Available', occupant: null },
  { id: 'L1-S03', area: 'Level 1: Collaborative Zone', nfcUid: '04:FF:E2:33:6B:40:80', status: 'Booked', occupant: 'Siti Aminah (A22CS0032)' },
  { id: 'L1-S04', area: 'Level 1: Collaborative Zone', nfcUid: '04:2E:7A:B2:CC:5F:80', status: 'Available', occupant: null },
  { id: 'L2-S01', area: 'Level 2: Quiet Study Area', nfcUid: '04:E3:4C:6A:B2:1A:80', status: 'Booked', occupant: 'Tan Mei Ling (A21EC0052)' },
  { id: 'L2-S02', area: 'Level 2: Quiet Study Area', nfcUid: '04:77:88:99:AA:BB:CC', status: 'Available', occupant: null }
];

let blacklist = [
  { studentId: 'A22CS0148', name: 'Ahmad Faiz bin Azmi', strikes: 3, status: 'Blacklisted' },
  { studentId: 'A21EC0052', name: 'Tan Mei Ling', strikes: 2, status: 'Active' },
  { studentId: 'A22CS0089', name: 'Saraswathy a/p Mohan', strikes: 3, status: 'Blacklisted' }
];

let complaints = [
  {
    id: 'CMP-2026-081',
    category: 'Air Conditioning',
    seatId: 'L2-S04',
    area: 'Level 2: Quiet Study Area',
    status: 'Pending',
    date: '2026-05-24',
    facilityDetails: 'Condensation water leaking from ceiling unit.',
    adminComments: 'Service scheduled for F&M department.'
  }
];

let lostFound = [
  {
    id: 'LF-902',
    name: 'Apple iPad Air (5th Gen)',
    description: 'Space Gray color, dark green magnetic case.',
    location: 'Level 2: Quiet Study Area (Desk 22)',
    date: '2026-05-23',
    status: 'Unclaimed',
    claimedBy: '',
    claimDate: ''
  }
];

// --- ROUTES ---

// Health & Info Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'LibraryGo API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// --- SEAT MANAGEMENT API ---
app.get('/api/seats', (req, res) => {
  res.json(seats);
});

app.put('/api/seats/:id/toggle', (req, res) => {
  const { id } = req.params;
  const seat = seats.find(s => s.id === id);
  if (!seat) {
    return res.status(404).json({ error: 'Seat not found' });
  }
  
  seat.status = seat.status === 'Available' ? 'Booked' : 'Available';
  seat.occupant = seat.status === 'Booked' ? 'Walk-in Student' : null;
  
  res.json({ message: `Seat ${id} status updated successfully`, seat });
});

// --- STUDENT BLACKLIST API ---
app.get('/api/blacklist', (req, res) => {
  res.json(blacklist);
});

app.post('/api/blacklist/strike', (req, res) => {
  const { studentId, name, strikes } = req.body;
  if (!studentId || !name) {
    return res.status(400).json({ error: 'Student ID and name are required' });
  }
  
  const formattedId = studentId.toUpperCase();
  const existing = blacklist.find(b => b.studentId === formattedId);
  
  if (existing) {
    existing.strikes = Math.min(existing.strikes + strikes, 3);
    if (existing.strikes >= 3) {
      existing.status = 'Blacklisted';
    }
    return res.json({ message: 'Strikes updated', record: existing });
  }
  
  const newRecord = {
    studentId: formattedId,
    name,
    strikes: strikes || 1,
    status: (strikes || 1) >= 3 ? 'Blacklisted' : 'Active'
  };
  blacklist.push(newRecord);
  res.status(201).json({ message: 'Student strike logged successfully', record: newRecord });
});

app.put('/api/blacklist/:studentId/reset', (req, res) => {
  const { studentId } = req.params;
  const record = blacklist.find(b => b.studentId === studentId.toUpperCase());
  
  if (!record) {
    return res.status(404).json({ error: 'Student record not found' });
  }
  
  record.strikes = 0;
  record.status = 'Active';
  res.json({ message: `Strike count reset for ${studentId}`, record });
});

// --- COMPLAINTS API ---
app.get('/api/complaints', (req, res) => {
  res.json(complaints);
});

app.post('/api/complaints', (req, res) => {
  const { category, seatId, area, facilityDetails } = req.body;
  const newComplaint = {
    id: `CMP-${new Date().getFullYear()}-${100 + complaints.length}`,
    category,
    seatId,
    area,
    status: 'Pending',
    date: new Date().toISOString().split('T')[0],
    facilityDetails,
    adminComments: ''
  };
  complaints.push(newComplaint);
  res.status(201).json(newComplaint);
});

app.put('/api/complaints/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, adminComments } = req.body;
  const complaint = complaints.find(c => c.id === id);
  
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }
  
  if (status) complaint.status = status;
  if (adminComments !== undefined) complaint.adminComments = adminComments;
  
  res.json({ message: 'Complaint updated', complaint });
});

// --- LOST & FOUND API ---
app.get('/api/lostfound', (req, res) => {
  res.json(lostFound);
});

// Server Initialization
app.listen(PORT, () => {
  console.log(`🚀 LibraryGo Express backend running on http://localhost:${PORT}`);
});
