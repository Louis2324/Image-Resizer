const { app , BrowserWindow , Menu }= require("electron");
const path = require("path");

const isMac = process.platform == "darwin";
const isDev = process.env.NODE_ENV !== "production"

function createMainWindow () {
    const mainWindow = new BrowserWindow({
        title:"Image Resizer",
        width:isDev?1000:500,
        height:600,
    });

    //dev-tools
    if(isDev) mainWindow.webContents.openDevTools();
    mainWindow.loadFile(path.join(__dirname,"./renderer/index.html"));
}
function createAboutWindow () {
    const aboutWindow = new BrowserWindow({
        title:"About Image Resizer",
        width:isDev?600:300,
        height:300,
    });

    aboutWindow.loadFile(path.join(__dirname,"./renderer/about.html"));
}

app.whenReady().then(()=>{
    createMainWindow();

    app.on('activate', ()=>{
        if(BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });

     const mainMenu = Menu.buildFromTemplate(menu);
     Menu.setApplicationMenu(mainMenu);
});

const menu = [
...(isMac?[
    {
        label:app.name,
        submenu:
        [
            {
                label: 'About',
            },
        ]
    }
  ]:[]),
 {
   role: "fileMenu"
 },
 ...(!isMac?[{
    label: 'Help',
    submenu: [{
        label:"About",
    }],
 }]:[]),
];

app.on('window-all-closed', ()=>{
    if(isMac){
        app.quit();
    }
})