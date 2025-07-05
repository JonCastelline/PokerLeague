## Product Requirements Document: Poker League

| | |
| :--- | :--- |
| **Document Title** | Poker League Application PRD |
| **Version** | 1.0 |
| **Date** | July 4, 2025 |
| **Status** | Final Draft |
| **Author** | Gemini Product Manager |
| **Stakeholder** | Jon |

### 1. Overview

This document outlines the requirements for the Minimum Viable Product (MVP) of the Poker League application. This application aims to be the all-in-one digital companion for home poker leagues, simplifying league management, enhancing player engagement, and preserving the history and rivalries of every season. It will provide tools for live game management, historical tracking, and league communication.

### 2. User Personas

The application will be built to serve the following user personas:

* **League Administrator ("Admin"):** The creator and manager of a league. They are responsible for league settings, scheduling games, managing players, and running live game sessions.
* **Player:** A member of a league. They use the app to view their standings, check the game schedule, review past game history, and follow along with league news.
* **Unaffiliated User:** A new user who has created an account but has not yet created or joined a league.

### 3. MVP Feature Requirements

The following features are defined for the initial V1.0 release.

#### **Epic: Onboarding & Account Management**

| User Story ID | User Story | Acceptance Criteria |
| :--- | :--- | :--- |
| **ONB-01** | As a new user, I want to sign up for an account using either my social media login (Google) or my email and a password. | - The signup page provides options for "Sign up with Google" and "Sign up with Email". <br> - Email-based signup requires a valid email and a password that is salted and hashed. |
| **ONB-02** | As an unaffiliated user, I want to see a landing page that prompts me to either create a new league or join an existing one. | - After logging in, if the user is not a member of any league, the page displays two primary actions: "Create a League" and "Join a League". |
| **ONB-03** | As an Admin, I want to invite new players to my league by generating a temporary invite code. | - Admins can generate an invite code that is valid for 24 hours. <br> - The invite flow allows searching for existing app users by name/email or sending an email to a new user. |
| **ONB-04** | As a new Player, I want to join a league using an invite code and set my league-specific display name. | - A user can enter a valid invite code to join a league. <br> - Upon joining, the user is prompted to create a `player_name` that will be used for display within that league. |
| **ONB-05** | As a user in multiple leagues, I want to easily switch between my leagues from the main navigation. | - A dropdown menu is present in the main navigation bar that lists all leagues the user is a member of. <br> - Selecting a league from the dropdown switches the entire app context (Home, Standings, etc.) to that league. |

#### **Epic: League Viewing & Information**

| User Story ID | User Story | Acceptance Criteria |
| :--- | :--- | :--- |
| **LVI-01** | As an Admin, I want to customize the league's home page with news and updates. | - The home page content can be edited by an Admin. <br> - For MVP, the editor is a simple text area supporting basic formatting (e.g., Markdown). <br> - Admins can include images by pasting an external image URL. |
| **LVI-02** | As a Player, I want to view the league standings to see my rank and stats. | - The Standings page displays a list of players ranked by Overall Score. <br> - The score is calculated as: `Overall Score = Points + (Kills * Kill_Point_Value) + (Bounties * Bounty_Point_Value)`. <br> - Players with the same score are shown with the same rank number (e.g., 1, 1, 3) and are sorted alphabetically. <br> - Displayed columns (Kills, Bounties) depend on league settings. |
| **LVI-03** | As a Player, I want to view the history of past games and seasons. | - The History page lists games grouped by season. <br> - Clicking a completed game navigates to a detailed results page showing final places, stats, and an optional recap. |
| **LVI-04** | As a Player, I want to see the schedule of upcoming games on a calendar. | - The Calendar page displays scheduled future games. <br> - The page provides a Calendar Subscription Link (.ics file) that players can add to their native calendar app (Google, Apple, etc.). |

#### **Epic: Live Game Play (Admin-Led MVP)**

| User Story ID | User Story | Acceptance Criteria |
| :--- | :--- | :--- |
| **LGP-01** | As an Admin, I want to start either a scheduled league game or a casual non-league game from the Play page. | - The Play page first prompts the admin to select a game type. <br> - Options are a dropdown of unplayed league games or "Non-League Game". <br> - For league games, the system loads the official player list. <br> - For non-league games, the admin can add players manually. |
| **LGP-02** | As an Admin running a league game, I want to mark players who are not in attendance as "not playing" before the game starts. | - Before starting the timer, the Play page shows a list of all league players. <br> - The admin can toggle each player's status between "Playing" and "Not Playing". |
| **LGP-03** | As an Admin, I want to manage the game using a timer with blind levels. | - The Play page displays a countdown timer for the current level. <br> - The current and next small/big blinds are displayed. <br> - Admins can pause, start, and manually edit the time on the timer. <br> - Admins can navigate between levels using "Next" and "Prev" buttons. |
| **LGP-04** | As an Admin, I want to eliminate a player and assign the kill/bounty to the correct person. | - The elimination flow follows the V1 prototype design: <br> &nbsp;&nbsp;&nbsp; 1. Admin taps the player to be eliminated to select them. <br> &nbsp;&nbsp;&nbsp; 2. Admin taps the "Eliminate" button. <br> &nbsp;&nbsp;&nbsp; 3. The player is marked eliminated and assigned a place. A text prompt "Which player claimed the kill?" appears. <br> &nbsp;&nbsp;&nbsp; 4. Admin taps a remaining player to assign them the kill (and bounty, if applicable). |
| **LGP-05** | As an Admin, I want an "Undo" button to correct an accidental elimination. | - An "Undo Last Elimination" button is visible only to admins on the Play page. <br> - Clicking it reverts the state of the game to before the last elimination occurred. |
| **LGP-06** | As an Admin, I want to review and correct results after the game is over before saving them permanently. | - When the game ends, a "Final Results" screen is shown. <br> - The admin can click "Edit Results" to modify player places or kills via a simple interface. <br> - The admin must click "Finalize & Save" to commit the results to the league history. |

#### **Epic: League Administration**

| User Story ID | User Story | Acceptance Criteria |
| :--- | :--- | :--- |
| **ADM-01**| As an Admin, I want a settings page where I can configure the rules for each season. | - Admins can access a League Settings page. <br> - Settings are season-specific. <br> - Configurable options include: tracking kills/bounties, point values for places/kills/bounties, timer duration, blind structure, and bounty rules on leader absence. |
| **ADM-02**| As an Admin, I want to grant or revoke admin privileges for other players in my league. | - The League Settings page has a "Manage Players" section. <br> - Admins can change another player's role between "Player" and "Admin". |

#### **Epic: Monetization**

| User Story ID | User Story | Acceptance Criteria |
| :--- | :--- | :--- |
| **MON-01**| As a user who wants to run multiple leagues, I want to make a one-time payment to unlock the ability to create unlimited leagues. | - Non-paying users are limited to creating one league. <br> - A payment option is available to upgrade the user's account. <br> - After a successful one-time payment, the user can create any number of leagues. |

### 4. System & Database Requirements

* The system must support the database schema `poker_league_schema.sql` with the agreed-upon modifications.
* A new table, `league_membership`, will be created to manage user roles on a per-league basis, replacing the admin flags on the `player_account` table.
* The `league_settings` table must include a field to handle the bounty logic when a points leader is absent (Options: "No Bounty" or "Next Highest Player").

### 5. Post-MVP / Future Enhancements

The following features have been explicitly deferred from the V1.0 release to manage scope and will be prioritized in a future backlog.

* **Live Player Sync:** A real-time synchronized Play page visible to all players in the game, not just the admin.
* **Super Admin Panel:** A dedicated interface for a global super admin to manage the application and correct data without direct database manipulation.
* **Rich Content Editor:** A full WYSIWYG editor for the league home page to allow for more advanced formatting and easier image uploads.
* **Historical Data Correction:** A UI for admins to edit the results of past, finalized games.
