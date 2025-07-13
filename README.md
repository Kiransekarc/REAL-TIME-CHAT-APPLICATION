REAL-TIME CHAT APPLICATION

*COMPANY* : CODTECH IT SOLUTIONS

*NAME* : KIRAN SEKAR C

*INTERN ID* : CT04DF2036

*DOMAIN* : MERN STACK

*DURATION* : 4 WEEKS

*MENTOR* : NEELA SANTHOSH


📌 Task 1 Objective – Real-Time Chat App

As part of the CodTech MERN Stack Internship, the first task involved building a real-time chat application.

The main goal was to enable multiple users to communicate with each other instantly and seamlessly.

This project utilized WebSockets, a protocol that facilitates two-way interactive communication between a client (browser) and a server.

The chat system had to support live message delivery, without requiring page refreshes.

The app was designed to simulate real-time communication similar to platforms like:
-> WhatsApp
-> Slack
-> Discord

The task focused on building a functional and minimal chat platform using modern web technologies from the MERN stack.

🧰 Technologies and Tools Used
To complete this task efficiently and professionally, I used the following technologies:

1. Frontend (React.js)
React.js is a powerful JavaScript library used for building user interfaces.

It provides a component-based structure that allowed me to break the chat interface into reusable and manageable parts.

The real-time UI updates without reloading the page were achieved using React hooks like useState and useEffect.

2. Backend (Node.js + Express.js)
Node.js provides a JavaScript runtime on the server side.

I used Express.js, a minimal and flexible Node.js framework, to create a lightweight backend server that can handle HTTP requests.

3. Socket.IO
This is the core technology that enabled real-time communication.

Socket.IO is a JavaScript library for real-time web applications. It enables event-driven communication between the client and server using WebSockets.

It allowed me to broadcast messages to all connected users instantly.

4. Code Editor
I used Visual Studio Code (VS Code) as the primary code editor.

Its support for JavaScript, Node.js, and React development made it ideal for full-stack MERN development.

Extensions like ESLint, Prettier, and Live Server enhanced development speed and code quality.

5. Package Managers
npm (Node Package Manager) was used to install and manage all project dependencies like express, socket.io, and react-scripts.

🖥️ How It Works
The backend server (Node.js + Express) listens on port 5000.

When a user connects from the frontend React app (running on port 3000), a socket connection is established using Socket.IO.

As the user sends a message, it emits a send_message event via the socket.

The server receives the event and broadcasts it to all other connected clients using the receive_message event.

All clients update their chat window in real-time using React state hooks.

🌐 Practical Applications
This type of real-time communication system has many real-world applications, such as:

Customer Support Systems

Live chatbots or support teams use real-time messaging to help users resolve issues instantly.

Collaborative Platforms

Apps like Google Docs, Figma, or Trello include chat for better coordination among teams.

Social Media and Messaging Apps

WhatsApp, Facebook Messenger, Instagram DM, and Discord all rely heavily on real-time chat.

Gaming Applications

Multiplayer games use real-time messaging for communication between players.

Educational Platforms

Online learning portals offer live chat features for doubt clearing and collaborative study.

🛠️ Development Process
I started by setting up the backend using Node.js and Express.

I then added Socket.IO to handle real-time socket communication.

For the frontend, I created a basic React app using create-react-app.

I designed a simple UI that includes a message display window, input field, and send button.

Then I integrated Socket.IO on the client side using socket.io-client.

Finally, I tested the app on two browser windows to simulate chat between two users.

🧪 Testing and Validation
I tested the app by opening it in multiple tabs.

Messages typed in one tab instantly appeared in the other without page refresh.

All events and connections were logged in the backend console to confirm socket connections and disconnections.

✅ Conclusion (Broken into Points)
This task significantly improved my understanding of real-time web applications, especially how live data exchange happens between users.

I gained practical knowledge of client-server communication, using tools like Socket.IO to establish real-time connections.

It strengthened my grasp on full-stack development, combining both the frontend (React) and backend (Node.js + Express).

Working with Socket.IO helped me understand its role in creating responsive, real-world applications like chat apps, collaborative tools, and live notifications.

Building this application also gave me experience in structuring a project, managing dependencies, and testing functionality across multiple clients.

Overall, this was a valuable hands-on experience that has equipped me with the skills needed to develop interactive, scalable, and dynamic web applications in real-world scenarios.

OUTPUT :-

https://github.com/Kiransekarc/REAL-TIME-CHAT-APPLICATION/issues/1#issue-3226166240
