# new-JavaCard-simulator

This project was produced as a MSc Dissertation and serves as a refactoring of a previous BSc Dissertation by Adam Noakes.

The original project is available at: https://github.com/adamnoakes/javacard-simulator.

The original project provided an open platform for the simulation of Java Card applets using Node.js. This project refactored the simulator by:

   - Extend the current simulator to provide efficient asynchronous execution.
   - Extend the current simulator to execute Java Card code byte-by-byte on Chrome browser.
   
Run app:
1. Clone the repository
2. Access the folder in terminal and run npm i (this will install all the node packagies in package.json)
3. Deploy the app on a local static server 
   (e.g. npm static-server. Check this page for details: https://www.npmjs.com/package/staticserver) 
4. Open a browser ->  http//localhost:<port>/views/layout.html
