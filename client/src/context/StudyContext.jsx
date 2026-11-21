import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api';

const StudyContext = createContext();

export const useStudy = () => useContext(StudyContext);

const DEFAULT_DOC = {
  name: 'Computer_Networks_Unit_2.pdf',
  subject: 'Computer Networks',
  text: `Computer Networks Unit 2: Transport Layer Protocols.
TCP (Transmission Control Protocol) is a connection-oriented, reliable protocol providing full-duplex byte-stream delivery. It handles congestion control using Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery.
The Congestion Window (cwnd) dictates how many bytes can be transmitted without acknowledgement. Slow start begins with cwnd = 1 MSS and doubles every RTT until ssthresh (slow start threshold) is reached.
Flow control uses Sliding Window Protocol to ensure the receiver buffer is not overwhelmed, using Stop-and-Wait, Go-Back-N (GBN), and Selective Repeat (SR).
UDP (User Datagram Protocol) is a lightweight, connectionless alternative prioritizing speed over reliability, commonly used for DNS, VoIP, and real-time gaming.`,
  summaryData: {
    examSummary: [
      'TCP is a connection-oriented protocol that ensures reliable, ordered packet delivery with flow and congestion control.',
      'Congestion Control operates via four key algorithms: Slow Start (exponential cwnd growth), Congestion Avoidance (linear growth), Fast Retransmit (3 duplicate ACKs), and Fast Recovery.',
      'Sliding Window protocols manage flow control, contrasting Go-Back-N (retransmits from lost packet onward) with Selective Repeat (retransmits only lost packets).',
      'UDP offers minimal overhead for real-time applications where latency is prioritized over packet loss guarantees.'
    ],
    keyConcepts: [
      { term: 'Congestion Window (cwnd)', definition: 'TCP state variable that limits the maximum amount of unacknowledged data in transit.' },
      { term: 'Slow Start Threshold (ssthresh)', definition: 'The target cwnd size where TCP transitions from exponential growth to linear congestion avoidance.' },
      { term: 'Fast Retransmit', definition: 'Detects packet loss after receiving 3 duplicate ACKs and retransmits immediately before timer expiration.' },
      { term: 'Selective Repeat (SR)', definition: 'Flow control mechanism where receiver buffers out-of-order packets and sender retransmits only missing segments.' }
    ],
    detailedNotes: [
      {
        title: 'TCP Congestion Control Algorithms',
        points: [
          'Slow Start: cwnd starts at 1 MSS, doubles every RTT until cwnd >= ssthresh.',
          'Congestion Avoidance: cwnd grows linearly (cwnd += 1 per RTT) to probe bandwidth cautiously.',
          'Loss Handling: Timeout causes ssthresh = cwnd / 2 and resets cwnd to 1 MSS (Tahoe); 3 duplicate ACKs triggers Fast Recovery (Reno).'
        ]
      },
      {
        title: 'Flow Control & Sliding Window',
        points: [
          'Stop-and-Wait: High propagation delay inefficiency with window size = 1.',
          'Go-Back-N: Retransmits all N frames from the point of packet drop.',
          'Selective Repeat: Requires receiver buffer and independent ACK timers for optimal bandwidth utilization.'
        ]
      }
    ],
    flashcards: [
      { front: 'What causes TCP to enter Fast Retransmit?', back: 'The arrival of 3 duplicate ACKs indicating a lost segment.' },
      { front: 'How does cwnd grow during Slow Start vs Congestion Avoidance?', back: 'Exponentially (doubles every RTT) during Slow Start; linearly (+1 MSS per RTT) during Congestion Avoidance.' },
      { front: 'What is the main advantage of Selective Repeat over Go-Back-N?', back: 'Only the lost packets are retransmitted, preventing redundant retransmissions.' }
    ],
    questions: [
      { question: 'Explain the four algorithms of TCP Congestion Control with a diagram and cwnd timeline.', type: '5 Marks', answer: 'Detail Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery.' },
      { question: 'Differentiate between Go-Back-N and Selective Repeat ARQ protocols.', type: '2 Marks', answer: 'GBN retransmits all subsequent packets; SR retransmits only lost packets.' }
    ],
    quickStats: {
      keyConcepts: 4,
      mainTopics: 2,
      examRelevance: 'Very High (15+ marks)'
    }
  }
};

export const StudyProvider = ({ children }) => {
  const [activeDocument, setActiveDocument] = useState(() => {
    try {
      const saved = localStorage.getItem('edumind_active_doc');
      return saved ? JSON.parse(saved) : DEFAULT_DOC;
    } catch {
      return DEFAULT_DOC;
    }
  });

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (activeDocument) {
      try {
        localStorage.setItem('edumind_active_doc', JSON.stringify(activeDocument));
      } catch (err) {
        console.warn('Could not save to localStorage:', err);
      }
    }
  }, [activeDocument]);

  // Upload and process a new PDF or text document
  const uploadAndAnalyzeDocument = async (file, textInput = '') => {
    setIsProcessing(true);
    try {
      let res;
      let subjectName = 'Study Material';
      let docName = 'Uploaded_Notes.txt';

      if (file) {
        docName = file.name;
        subjectName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('subject', subjectName);
        res = await API.post('/notes/summarize', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        subjectName = 'Custom Notes';
        res = await API.post('/notes/summarize', {
          text: textInput,
          subject: subjectName,
        });
      }

      if (res.data && res.data.data) {
        const newDoc = {
          name: docName,
          subject: subjectName,
          text: res.data.extractedText || textInput || (file ? `PDF Document: ${file.name}` : ''),
          summaryData: res.data.data,
          uploadedAt: new Date().toISOString(),
        };
        setActiveDocument(newDoc);
        return { success: true, doc: newDoc };
      }
      return { success: false, error: 'Empty summary returned' };
    } catch (err) {
      console.error('Document analysis error:', err);
      return { success: false, error: err.response?.data?.error || err.message };
    } finally {
      setIsProcessing(false);
    }
  };

  const clearDocument = () => {
    setActiveDocument(null);
    localStorage.removeItem('edumind_active_doc');
  };

  return (
    <StudyContext.Provider
      value={{
        activeDocument,
        setActiveDocument,
        uploadAndAnalyzeDocument,
        clearDocument,
        isProcessing,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};
