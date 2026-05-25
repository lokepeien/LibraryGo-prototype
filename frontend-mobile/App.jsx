import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';

export default function App() {
  // Simulator States
  const [studentId, setStudentId] = useState('A22CS0148');
  const [studentName, setStudentName] = useState('Ahmad Faiz bin Azmi');
  const [strikes, setStrikes] = useState(0);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [activeSeat, setActiveSeat] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [graceTimer, setGraceTimer] = useState(900); // 15 minutes grace period in seconds

  useEffect(() => {
    let interval = null;
    if (isCheckedIn && graceTimer > 0) {
      interval = setInterval(() => {
        setGraceTimer((prev) => prev - 1);
      }, 1000);
    } else if (graceTimer === 0) {
      handleTimeout();
    }
    return () => clearInterval(interval);
  }, [isCheckedIn, graceTimer]);

  const handleTimeout = () => {
    setIsCheckedIn(false);
    setActiveSeat(null);
    setStrikes(prev => Math.min(prev + 1, 3));
    Alert.alert(
      '⚠️ Grace Period Timeout',
      'You failed to verify your booking by scanning the physical NFC desk tag within 15 minutes. 1 disciplinary strike has been issued.',
      [{ text: 'Dismiss' }]
    );
  };

  const simulateNfcScan = () => {
    if (strikes >= 3) {
      Alert.alert(
        '⛔ Access Denied',
        'Your account is currently blacklisted due to 3 accumulated disciplinary strikes. Please contact the librarian desk.',
        [{ text: 'OK' }]
      );
      return;
    }

    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      if (isCheckedIn) {
        // Checking out
        setIsCheckedIn(false);
        setActiveSeat(null);
        Alert.alert('✅ Checked Out', 'Thank you! You have successfully vacated Seat L2-S04.', [{ text: 'OK' }]);
      } else {
        // Checking in
        setIsCheckedIn(true);
        setActiveSeat('L2-S04');
        setGraceTimer(900); // Reset timer
        Alert.alert(
          '🎉 Checked In Successfully',
          'NFC Tag verified: 04:E3:4C:6A:B2:1A:80.\nSeat L2-S04 is reserved for your session.',
          [{ text: 'Enjoy Studying!' }]
        );
      }
    }, 1500);
  };

  const triggerReportIncident = () => {
    Alert.alert(
      '🛠️ Report Facility Issue',
      'Reporting a complaint for Seat L2-S04? This will notify library maintenance immediately.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit AC Leak Report', onPress: () => Alert.alert('Submitted', 'Complaint registered under CMP-2026-085.') }
      ]
    );
  };

  const getTimerString = () => {
    const minutes = Math.floor(graceTimer / 60);
    const seconds = graceTimer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1677ff" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Mobile Header */}
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>UTM LibraryGo</Text>
          <Text style={styles.headerTitle}>Student Companion</Text>
        </View>

        {/* Student Matrix Profile */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Identity Profile</Text>
          <View style={styles.profileRow}>
            <View>
              <Text style={styles.studentName}>{studentName}</Text>
              <Text style={styles.studentId}>Matrix ID: {studentId}</Text>
            </View>
            <View style={[styles.statusTag, strikes >= 3 ? styles.bannedTag : styles.activeTag]}>
              <Text style={styles.statusTagText}>{strikes >= 3 ? 'BANNED' : 'ACTIVE'}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.strikeLabel}>Disciplinary Strike Counters:</Text>
          <View style={styles.strikesContainer}>
            <View style={[styles.strikeBubble, strikes >= 1 ? styles.strikeActive : styles.strikeEmpty]}>
              <Text style={styles.strikeText}>1</Text>
            </View>
            <View style={[styles.strikeBubble, strikes >= 2 ? styles.strikeActive : styles.strikeEmpty]}>
              <Text style={styles.strikeText}>2</Text>
            </View>
            <View style={[styles.strikeBubble, strikes >= 3 ? styles.strikeActive : styles.strikeEmpty]}>
              <Text style={styles.strikeText}>3</Text>
            </View>
            <Text style={styles.strikeHelper}>({strikes}/3 strikes issued)</Text>
          </View>
        </View>

        {/* NFC Checking Interaction */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Physical NFC Check-In</Text>
          <Text style={styles.bodyText}>
            Approach any registered library study desk and tap your smartphone against the embedded NFC tag to check in or out.
          </Text>

          {scanning ? (
            <View style={styles.scanningBox}>
              <ActivityIndicator size="large" color="#1677ff" />
              <Text style={styles.scanningText}>Approaching NFC Tag... Hold still</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.nfcButton, isCheckedIn ? styles.nfcButtonActive : styles.nfcButtonDefault]}
              onPress={simulateNfcScan}
            >
              <Text style={styles.nfcButtonText}>
                {isCheckedIn ? '📱 TAP TO CHECK-OUT DESK' : '📱 TAP TO CHECK-IN DESK'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Active Booking Monitor */}
        {isCheckedIn && (
          <View style={[styles.card, styles.bookingCard]}>
            <Text style={styles.bookingTitle}>🟢 Active Desk Session</Text>
            
            <View style={styles.sessionRow}>
              <View>
                <Text style={styles.sessionLabel}>Assigned Seat:</Text>
                <Text style={styles.sessionValue}>{activeSeat}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.sessionLabel}>Auto-Release Grace:</Text>
                <Text style={styles.timerValue}>{getTimerString()}</Text>
              </View>
            </View>

            <View style={styles.divider} />
            
            <Text style={styles.bodyTextSmall}>
              Note: Vacation of seats for more than 15 minutes will auto-release booking and trigger a disciplinary penalty.
            </Text>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.reportButton} onPress={triggerReportIncident}>
                <Text style={styles.reportButtonText}>🛠️ Report Seat Defect</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Area Map Overview */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Library Seat Capacity</Text>
          
          <View style={styles.areaRow}>
            <Text style={styles.areaName}>Level 1: Collaborative Zone</Text>
            <Text style={styles.areaStatus}>4 / 6 Open</Text>
          </View>
          <View style={styles.areaRow}>
            <Text style={styles.areaName}>Level 2: Quiet Study Area</Text>
            <Text style={styles.areaStatus}>3 / 6 Open</Text>
          </View>
          <View style={styles.areaRow}>
            <Text style={styles.areaName}>Level 3: Postgraduate Hub</Text>
            <Text style={styles.areaStatus}>2 / 4 Open</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    backgroundColor: '#1677ff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bookingCard: {
    borderColor: '#b7eb8f',
    backgroundColor: '#f6ffed',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#52c41a',
    marginBottom: 12,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0f172a',
  },
  studentId: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeTag: {
    backgroundColor: '#e6f4ff',
  },
  bannedTag: {
    backgroundColor: '#fff1f0',
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1677ff',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  strikeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  strikesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  strikeBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  strikeActive: {
    backgroundColor: '#ff4d4f',
  },
  strikeEmpty: {
    backgroundColor: '#cbd5e1',
  },
  strikeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  strikeHelper: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  bodyText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 16,
  },
  bodyTextSmall: {
    fontSize: 11.5,
    color: '#64748b',
    lineHeight: 16,
    marginBottom: 12,
  },
  nfcButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nfcButtonDefault: {
    backgroundColor: '#1677ff',
  },
  nfcButtonActive: {
    backgroundColor: '#fa8c16',
  },
  nfcButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  scanningBox: {
    padding: 16,
    alignItems: 'center',
  },
  scanningText: {
    marginTop: 8,
    fontSize: 13,
    color: '#1677ff',
    fontWeight: '600',
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sessionLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  sessionValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  timerValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ff4d4f',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  reportButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ffa39e',
    borderRadius: 6,
  },
  reportButtonText: {
    color: '#ff4d4f',
    fontSize: 12.5,
    fontWeight: '600',
  },
  areaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  areaName: {
    fontSize: 13,
    color: '#334155',
  },
  areaStatus: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1677ff',
  }
});
