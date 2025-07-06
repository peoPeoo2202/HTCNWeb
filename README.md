# 🍎 Fruit Box Match-3 Game 🍊

A colorful and engaging match-3 puzzle game built with HTML5, CSS3, and JavaScript. Match 3 or more identical fruit boxes to make them disappear and score points!

## 🎮 Game Features

### Core Gameplay
- **8x8 Grid**: Start with an 8x8 game board that expands as you progress
- **Multiple Fruit Types**: 8 different fruit emojis (🍎 🍊 🍌 🍇 🍓 🥝 🍑 🥭)
- **Match-3 Mechanics**: Match 3 or more identical fruits horizontally or vertically
- **Cascading Effects**: When fruits disappear, new ones fall down to fill empty spaces
- **Chain Reactions**: Multiple matches can occur in sequence for bonus points

### Game Progression
- **Level System**: Progress through multiple levels with increasing difficulty
- **Move Limit**: Complete objectives within 30 moves per level
- **Target Goals**: Collect specific amounts of different fruits to complete levels
- **Board Expansion**: Board size increases every 3 levels (up to 10x10)

### Scoring System
- **Base Points**: 10 points per matched fruit × current level
- **Level Bonus**: 500 bonus points for completing a level
- **Match Bonuses**: Extra animations and points for larger matches

### Power-ups
- **💣 Bomb**: Clears a 3x3 area around the selected box
- **🌈 Rainbow**: Removes all fruits of the same type as selected
- **⚡ Lightning**: Clears entire row and column of selected box

### Visual Features
- **Smooth Animations**: Falling, matching, and explosion effects
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Beautiful UI**: Gradient backgrounds, hover effects, and modern design
- **Visual Feedback**: Selection highlighting, hint system, and match celebrations

## 🎯 How to Play

### Basic Controls
1. **Select**: Click on a fruit box to select it (highlighted in blue)
2. **Swap**: Click on an adjacent box to swap with the selected one
3. **Match**: Create lines of 3+ identical fruits to make them disappear
4. **Objectives**: Complete the level goals shown in the sidebar

### Power-up Usage
1. Click on a power-up button in the sidebar to activate it
2. Click on the game board where you want to use the power-up
3. Power-ups have limited uses per level

### Level Progression
- Complete all target objectives before running out of moves
- Each level has specific fruit collection goals
- Successfully completing a level advances you to the next one
- Higher levels introduce more fruit types and larger boards

### Tips for Success
- Use the **Hint** button if you're stuck (shows possible matches)
- Save power-ups for when you really need them
- Look for opportunities to create chain reactions
- Plan your moves carefully - you only have 30 per level!

## 🚀 Getting Started

### Option 1: Local Server (Recommended)
```bash
# Navigate to the game directory
cd /path/to/fruit-box-game

# Start a local web server
python3 -m http.server 8080
# OR
python -m http.server 8080

# Open your browser and go to:
# http://localhost:8080
```

### Option 2: Direct File Opening
Simply open `index.html` in your web browser. Note that some features may not work properly due to browser security restrictions.

### Option 3: Live Server (VS Code)
If you're using VS Code:
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 📱 Browser Support

The game works on all modern browsers:
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Technical Features

### Performance Optimizations
- Efficient match detection algorithms
- Smooth CSS animations with hardware acceleration
- Responsive grid system using CSS Grid
- Optimized event handling

### Responsive Design
- Mobile-first design approach
- Adaptive layout for different screen sizes
- Touch-friendly interface for mobile devices
- Smaller grid (6x6) on very small screens

### Code Structure
- **Object-oriented JavaScript**: Clean, maintainable class-based structure
- **Modern CSS**: Flexbox, Grid, and advanced animations
- **Semantic HTML**: Accessible and well-structured markup

## 🎯 Game Rules

1. **Matching**: Connect 3 or more identical fruits in a line (horizontal or vertical)
2. **Swapping**: Only adjacent fruits can be swapped
3. **Valid Moves**: Swaps must result in at least one match
4. **Gravity**: Fruits fall down to fill empty spaces
5. **Objectives**: Complete level goals within the move limit
6. **Power-ups**: Limited special abilities to help clear difficult situations

## 🏆 Scoring Guide

| Action | Points |
|--------|---------|
| 3-fruit match | 30 × level |
| 4-fruit match | 40 × level |
| 5+ fruit match | 50+ × level |
| Level completion | 500 bonus |
| Chain reactions | Multiplied bonuses |

## 🔧 Customization

The game is easily customizable:
- **Fruits**: Change the fruit emojis in the `fruits` array
- **Board Size**: Modify `boardSize` parameter
- **Difficulty**: Adjust move limits and target goals
- **Colors**: Update CSS gradient variables
- **Power-ups**: Add new power-up types in the game logic

## 📄 Files Structure

```
fruit-box-game/
├── index.html      # Main HTML structure
├── style.css       # All styling and animations
├── script.js       # Game logic and interactions
└── README.md       # This documentation
```

## 🎉 Enjoy Playing!

Have fun matching fruits and climbing the levels! The game gets progressively more challenging with new fruit types and larger boards. Can you reach the highest level?

---

Made with ❤️ using HTML5, CSS3, and JavaScript