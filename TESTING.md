# Quick Testing Guide - 5 Bosses

## ✅ Test Each Boss

### Boss 1: Echo (Specificity)
**Try these:**
- ❌ FAIL: "dinosaurs"
- ❌ FAIL: "tell me about dinosaurs"
- ✅ PASS: "tell me 5 facts about dinosaurs"
- ✅ PASS: "describe what dinosaurs looked like and what they ate"

### Boss 2: Twist (Neutral Framing)
**Try these:**
- ❌ FAIL: "why is space exploration good?"
- ❌ FAIL: "tell me the best things about robots"
- ✅ PASS: "what are the benefits of space exploration?"
- ✅ PASS: "explain the advantages of robots in manufacturing"

### Boss 3: Cipher (Context)
**Try these:**
- ❌ FAIL: "tell me about dinosaurs"
- ❌ FAIL: "space exploration"
- ✅ PASS: "write a short story about dinosaurs"
- ✅ PASS: "create a brief explanation of space in 3 paragraphs"

### Boss 4: Format (Structure)
**Try these:**
- ❌ FAIL: "tell me about planets"
- ❌ FAIL: "give me facts about volcanoes"
- ✅ PASS: "list 5 facts about planets in bullet points"
- ✅ PASS: "create a table showing 3 types of volcanoes"

### Boss 5: Multi (All Skills)
**Try these:**
- ❌ FAIL: "tell me about ancient Egypt"
- ❌ FAIL: "list facts about robots"
- ✅ PASS: "create a brief table with 5 facts about ancient Egypt"
- ✅ PASS: "write a short numbered list of 3 benefits of robots, explained simply"

---

## 🎮 Test Progression

1. **Start game** → Should be on Boss 1 (Echo)
2. **Beat Boss 1** → Should unlock Boss 2, show +50 XP
3. **Click "Next Boss"** → Should move to Boss 2 (Twist)
4. **Beat Boss 2** → Should show +75 XP, total 125 XP
5. **Click Boss 1 circle** (green) → Should go back to Boss 1
6. **Beat Boss 1 again** → XP should increase again
7. **Progress to Boss 5** → Beat it
8. **Check victory screen** → Should say "All bosses defeated!"

---

## 🔍 Visual Checks

- [ ] Progress circles show correctly (gray/purple/green)
- [ ] Boss name updates in header
- [ ] Challenge rule changes for each boss
- [ ] Boss personality different in responses
- [ ] Hints are boss-specific
- [ ] XP numbers are correct on victory
- [ ] Skill badge shows correct skill name
- [ ] Confetti still works
- [ ] Prompt comparison shows first vs final

---

## 🐛 Things to Watch For

- Does Boss 2 (Twist) properly reject opinion words?
- Does Boss 3 (Cipher) demand context?
- Does Boss 4 (Format) need structure words?
- Does Boss 5 (Multi) require combining skills?
- Do green circles let you go back?
- Does XP accumulate correctly?
- Do hints help players understand what's needed?

---

## 💡 Quick Debug

Open browser console (F12), type:
```javascript
// Jump to any boss
debugGame.getState().currentBoss = 3
debugGame.reset()

// Check current state
debugGame.getState()

// Test validation for specific boss
// (Boss 2 example)
debugGame.testValidation("what are the benefits of robots?")
```

---

## 📊 Success Metrics

After testing:
- [ ] All 5 bosses are beatable
- [ ] Each boss teaches its skill clearly
- [ ] Progression feels rewarding
- [ ] Kids understand differences between bosses
- [ ] No confusing bugs or errors

---

**Start testing now!** 🎮
Open index.html and try to beat all 5 bosses.
