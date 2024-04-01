# HabitTracker 
HabitTracker is a React-based application designed to help users build and track their daily habits. Leveraging the power of Capacitor for cross-platform functionality, users can commit to habits, track their progress, and visualize their consistency through a simple and intuitive interface.
## Features 
- **Habit Management**: Add, edit, and archive habits as your goals evolve.
- **Commit Tracking**: Log daily commits to habits, reinforcing your dedication.
- **Progress Visualization**: View your commitment history in a heatmap, offering insights into your consistency.
- **Cross-Platform**: Built with Capacitor, HabitTracker works on web, Android, and iOS platforms.
## Getting Started 
### Prerequisites
Before setting up the project, ensure you have the following installed: 
- Node.js (v14 or later recommended) 
- npm (v7 or later) 
### Installation
1. Clone the repository:    
	```bash 
	git clone https://github.com/yourusername/HabitTracker.git
	cd HabitTracker
	```


3. Install the dependencies and run:
	```bash
	npm install
	npm run dev
	```

4.  To build the project
	```bash
	npm run build
	```
### Running on Android/iOS

To run the application on Android or iOS devices, ensure you have the respective development environments set up, then use Capacitor to add the platform and run the application:

```bash
#Sync the build to Ios and android projects
npx cap sync
npx cap run android
# If that didnt work you can open it in android studio
npx cap open android
```
