let flashcardDecks = [
  {
    id: 'deck_1',
    name: 'Biology: Cell Structure',
    cardCount: 10,
    source: 'PDF to Flashcards',
    cards: [
      { id: 1, front: 'What is the powerhouse of the cell?', back: 'The mitochondria (generates ATP through oxidative phosphorylation).' },
      { id: 2, front: 'What is the function of the cell membrane?', back: 'Regulates passage of molecules into and out of the cell via selective permeability.' },
      { id: 3, front: 'Difference between prokaryotes and eukaryotes?', back: 'Prokaryotes lack a membrane-bound nucleus; eukaryotes have a membrane-bound nucleus and organelles.' },
    ],
  },
  {
    id: 'deck_2',
    name: 'Computer Networks: TCP/IP',
    cardCount: 8,
    source: 'Syllabus Chapter 2',
    cards: [
      { id: 1, front: 'What is the purpose of TCP 3-way handshake?', back: 'To synchronize sequence numbers (SYN, SYN-ACK, ACK) and establish a reliable full-duplex connection.' },
      { id: 2, front: 'What is the main difference between TCP and UDP?', back: 'TCP is connection-oriented, reliable, and ordered; UDP is connectionless, fast, and best-effort.' },
    ],
  },
];

const getFlashcards = (req, res) => {
  res.json({ decks: flashcardDecks });
};

const createCard = (req, res) => {
  const { deckId, front, back } = req.body;
  const deck = flashcardDecks.find((d) => d.id === deckId) || flashcardDecks[0];
  const newCard = { id: Date.now(), front, back };
  deck.cards.push(newCard);
  deck.cardCount = deck.cards.length;
  res.status(201).json({ message: 'Card added successfully', card: newCard });
};

module.exports = {
  getFlashcards,
  createCard,
};
