# Arts Management System - Pazhassiraja College

A professional, real-time management portal and appeal system for the Union Arts Festival. Built with a modern glassmorphic aesthetic and a robust Firebase backend, this system streamlines the coordination of Arts competitions from registration to result publication.

## 🚀 Features

### 🛡️ Command Center (Core Admin)
The super-administrator's gateway for total system control:
- **Active Node Monitoring**: Real-time tracking of online administrators and their session activities.
- **Access Control**: Granular management of admin roles and whitelist-based authentication.
- **Certificate Customization**: Dynamic configuration of festival titles, academic years, and official signatures for automated certificates.
- **Data Audit & Recovery**: Tools for scanning and restoring legacy records to ensure data integrity across academic cycles.

### 🎭 Stage Manager Portal
A dedicated operational dashboard for stage-level coordination:
- **Live Schedule**: Real-time view of upcoming and ongoing programs on the assigned stage.
- **Lottery System**: Digital lot drawing to ensure fair and randomized performance order.
- **Performance Capture**: Integrated video recording feature for documenting performances directly from the browser.
- **Result Submission**: Seamless upload of marks and grades for immediate admin review.

### 📊 Secretary Hub & Admin Dashboard
Unified tools for department secretaries and festival coordinators:
- **Registration Management**: Field-level control, chest number allocation, and global registration locking.
- **Program Scheduling**: Dynamic management of competition dates, venues, and schedules.
- **Real-time Feedback**: Modern, premium alert system for instant registration status updates.

### 📝 Student & Appeal Portals
User-friendly interfaces for participants:
- **Streamlined Registration**: Easy-to-use forms for individual and group events with real-time validation.
- **Appeal System**: A dedicated portal for submitting appeals with support for video evidence and rapid resolution tracking.

### 🏆 Real-time Leaderboard
- **Dynamic Standings**: Live-updating department-wise scores and rankings.
- **Mobile Optimized**: A sleek, space-efficient design ensuring a premium experience on any device.

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla JavaScript, CSS3 (Glassmorphism & Advanced Animations)
- **Backend**: Firebase (Firestore, Authentication, Hosting, Storage)
- **Icons**: Font Awesome 6
- **Typography**: Outfit & Inter (Google Fonts)

## 📁 Project Structure

The project is organized for scalability and ease of deployment:

- `/y`: The public web directory containing all application files.
  - `index.html`: Main landing page and primary entry point.
  - `coreadmin.html`: Super-admin command center.
  - `admin.html`: Unified administration console for staff and secretaries.
  - `stagemanager.html`: Operational portal for stage management.
  - `student.html`: Student-facing registration portal.
  - `appeal.html`: Participant appeal submission portal.
  - `leaderboard.html`: Public results and standings page.
  - `/assets`: CSS and JS assets organized by functional modules:
    - `admin/`, `coreadmin/`, `stagemanager/`, `core/`, `appeal/`
- `firebase.json`: Configuration for Firebase Hosting and route rewrites.
- `firestore.rules`: Security rules for Firestore data access.
- `package.json`: Project metadata and development dependencies.

## 📱 Mobile Responsiveness

The system features a **mobile-first** design philosophy, utilizing responsive CSS layouts to ensure that every portal—from the Command Center to the Leaderboard—remains functional and visually stunning on smartphones, tablets, and desktops.

## 🔧 Installation & Deployment

1. **Clone the repository**:
   ```bash
   git clone [repository-url]
   ```
2. **Setup Firebase**:
   Ensure you have the [Firebase CLI](https://firebase.google.com/docs/cli) installed and are logged in (`firebase login`).
3. **Deploy to Firebase**:
   ```bash
   firebase deploy
   ```

## 📄 License

This project is developed for the Pazhassiraja College Union Arts Festival. All rights reserved.

