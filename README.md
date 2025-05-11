# Imposter Game Webapp

A mobile-friendly webapp for playing the popular "Imposter" social deduction game with friends. Players attempt to identify the imposters in the group who don't know the secret role.

## Game Overview

In this game:
1. Players input their names on the homepage
2. You can select the number of imposters (default is 1)
3. The app assigns roles randomly - most players get the same role, but imposters don't know what it is
4. Players pass the device around to see their roles privately
5. During discussion, imposters try to blend in without revealing themselves
6. Regular players try to identify the imposters

## Features

- Mobile-optimized design for vertical orientation
- Add as many players as you want (minimum of 3)
- Configurable number of imposters
- Private role reveal screen for each player
- Beautiful and intuitive user interface

## Technology Stack

- React with TypeScript for type safety
- React Router for navigation
- Styled Components for styling
- Mobile-first design principles
- LocalStorage for game state management

## Getting Started

To run the project locally:

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to play the game.

## How to Play

1. **Setup**: Enter player names (minimum 3) and select the number of imposters
2. **Role Assignment**: Pass the device to each player who will view their role in private
3. **Gameplay**: 
   - Regular players know the assigned role and discuss it
   - Imposters don't know the role and must pretend they do
4. **Discussion**: Players talk about the role while looking for suspicious behavior
5. **Voting**: After discussion, players vote on who they think the imposters are

## Deployment

This app can be easily deployed to platforms like Netlify, Vercel, or GitHub Pages:

```bash
# Create a production build
npm run build
```

## License

MIT

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
