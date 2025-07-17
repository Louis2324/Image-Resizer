const { app , BrowserWindow , Menu , ipcMain ,shell}= require("electron");
const os = require('os');
const fs = require('fs');
const path = require("path");
const ResizeImg = require("resize-img");
let mainWindow;

const isMac = process.platform == "darwin";
const isDev = process.env.NODE_ENV !== "production"

function createMainWindow () {
    mainWindow = new BrowserWindow({
        title:"Image Resizer",
        width:isDev?1000:500,
        height:600,
         webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            sandbox:false, 
            preload: path.join(__dirname, './preload.js'),
        }
    });
    console.log(path.join(__dirname, 'preload.js'))
    //dev-tools
    if(isDev) mainWindow.webContents.openDevTools();
    mainWindow.loadFile(path.join(__dirname,"./renderer/index.html"));
}

function createAboutWindow () {
    const aboutWindow = new BrowserWindow({
        title:"About Image Resizer",
        width:300,
        height:300,
    });

    aboutWindow.loadFile(path.join(__dirname,"./renderer/about.html"));
}

const menu = [
...(isMac?[
    {
        label:app.name,
        submenu:
        [
            {
                label: 'About',
                click: createAboutWindow
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
        click: createAboutWindow,
    }],
 }]:[]),
];

app.whenReady().then(()=>{
    createMainWindow();

    app.on('activate', ()=>{
        if(BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });

     const mainMenu = Menu.buildFromTemplate(menu);
     Menu.setApplicationMenu(mainMenu);

     mainWindow.on('closed',()=> mainWindow = null);
});

ipcMain.on('image:resize', (e , options )=>{
    options.dest = path.join(os.homedir(),"imageResizer");
    resizeImage(options);
});

async function resizeImage ({imgPath , width , height , dest  }) {
    try {
        const newPath = await ResizeImg(fs.readFileSync(imgPath , {
            width : + width,
            height: +height,
        }));

        const fileName = path.basename(imgPath);

        //check destination folder 
        if(!fs.existsSync(dest)) {
            fs.mkdirSync(dest)
        }

        fs.writeFileSync(path.join(dest,fileName) , newPath);
        mainWindow.webContents.send('image: done');
        shell.openPath(dest);
    } catch (error) {
        console.log(error);
    }
 
}

app.on('window-all-closed', ()=>{
    if(isMac){
        app.quit();
    }
})
