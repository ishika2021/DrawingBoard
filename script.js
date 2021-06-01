let pencilEle=document.querySelector(".pencil_container");
let palettleEle=document.querySelector(".color_palette");
let drawingBoardEle=document.querySelector(".drawing_board");
let board=document.querySelector("#board");
let navigationEle=document.querySelector(".navigator");
let sideBarEle=document.querySelector(".side_bar");
let noteEle=document.querySelector(".add_note");
let eraserEle=document.querySelector(".eraser_container");
let undoBtn=document.querySelector(".undo_container");
let redoBtn=document.querySelector(".redo_container");
let zoomInBtn=document.querySelector(".zoom_in_container");
let zoomOutBtn=document.querySelector(".zoom_out_container");
let uploadBtn=document.querySelector("#upload");
let downloadBtn=document.querySelector("#download");
let settingBtn=document.querySelector("#setting");
let shapeEle=document.querySelector(".rectangle_container");
let aboutEle=document.querySelector(".about_container");
let root=document.querySelector(":root");
// ************************Variables*****************************
let pencilColor="black";
drawingBoardEle.style.cursor="default";
board.height=window.innerHeight;
board.width=window.innerWidth;
let tool=board.getContext("2d");
let activeTool;
let undoArr=[];
let redoArr=[];
let zoomLevel=1;
let rectColor="pencil";
// *********************Event Listeners************************

eraserEle.addEventListener("click",function(){
    activeTool="eraser";
    draw();
})
eraserEle.addEventListener("dblclick",function(){
    activeTool="eraser";
    tool.clearRect(0,0,board.width,board.height);
})
pencilEle.addEventListener("click",function(){
    let pencilMenuEle=document.querySelector(".pencil_menu");
    let pencilSize=3;
    let isActive=pencilMenuEle.classList.contains("active_box");
    activeTool="pencil";
    if(isActive==false){
        pencilMenuEle.classList.add("active_box");
        let sizePlus=document.querySelector(".sizePlus");
        let sizeMinus=document.querySelector(".sizeMinus");
        sizePlus.addEventListener("click",function(){
            if(pencilSize<6)
                pencilSize++;
                draw(pencilSize);
        })
        sizeMinus.addEventListener("click",function(){
            if(pencilSize>3)
                pencilSize--;
                draw(pencilSize);
        })

        draw(pencilSize);
        isActive=true;
    }else{
        pencilMenuEle.classList.remove("active_box");
        isActive=false;
    }
    
});
palettleEle.addEventListener("click",function(){
    let colorMenuEle=document.querySelector(".color_menu");
    let isActive=colorMenuEle.classList.contains("active_box");
    drawingBoardEle.style.cursor="default";
    console.log(isActive);
    if(isActive==false){
        colorMenuEle.classList.add("active_box");
        let colorArr=document.querySelectorAll(".color");
        for(let i=0;i<colorArr.length;i++){
            colorArr[i].addEventListener("click",function(){
                let color=colorArr[i].classList[1];
                switch(color){
                    case "color1": pencilColor='#ff9a9e';
                                   break;
                    case "color2": pencilColor='#96e6a1';
                                    break;
                    case "color3": pencilColor='#00f2fe';
                                    break;
                    case "color4": pencilColor='#cd9cf2';
                                    break;
                    case "color5": pencilColor='#2F323A';
                                    break;
                    case "color6": pencilColor='#D8315B';
                                    break;
                }
                draw();
            })
        }
        isActive=true;
    }else{
        colorMenuEle.classList.remove("active_box");
        isActive=false;
    }
})
noteEle.addEventListener("click",function(){
    
    let noteMenuEle=document.querySelector(".note_menu");
    let isActive=noteMenuEle.classList.contains("active_note");
    if(isActive==false){
        noteMenuEle.classList.add("active_note");
        let colorArr=document.querySelectorAll(".note_color");
        for(let i=0;i<colorArr.length;i++){
            colorArr[i].addEventListener("click",function(){
            drawingBoardEle.style.cursor="default";
            colorArr.forEach(function(color){
                color.classList.remove("active_color");
            })
            colorArr[i].classList.add("active_color");
        });
    }  
    createNote();
          
        isActive=true;
    }else{
        noteMenuEle.classList.remove("active_note");
        isActive=false;
    }
    
})
undoBtn.addEventListener("click",function(){
    if(undoArr.length>0){
        for(let i=0;i<undoArr.length;i++){
            let obj=undoArr.pop();
            redoArr.push(obj);
        }
        redraw(undoArr);
    }
       
})
redoBtn.addEventListener("click",function(){
    // undoArr.push(redoArr);
    if(redoArr.length>0 && undoArr.length>0){
        for(let i=0;i<undoArr.length/2;i++){
            let obj=redoArr.pop();
            undoArr.push(obj);
        }
        redraw(undoArr);
    }
        
})
zoomInBtn.addEventListener("click",function(){
    if(zoomLevel<3){
        zoomLevel+=0.5;
        board.style.transform=`scale(${zoomLevel})`;
    }
    
})
zoomOutBtn.addEventListener("click",function(){
    if(zoomLevel>1){
        zoomLevel-=0.5;
        board.style.transform=`scale(${zoomLevel})`;
    }
})
uploadBtn.addEventListener("click",function(){
    let inputBtn=document.querySelector("#upload_input");
    inputBtn.addEventListener("change",function(e){
        console.log("yp");
        if(e.target.files){
            let imgFile=e.target.files[0];
            let reader=new FileReader();
            reader.readAsDataURL(imgFile);
            reader.onloadend=function(e){
                let img=new Image();
                img.src=e.target.result;
                img.onload=drawImg(img);
                img.onerror=failImg;
            }

        }
    })
    inputBtn.click();
    
})
downloadBtn.addEventListener("click",function(){
    let link=document.createElement('a');
    link.download='draw.png';
    link.href=board.toDataURL();
    link.click();
})
settingBtn.addEventListener("click",function(){
    let settingMenuEle=document.querySelector(".setting_menu");
    let isActive=settingMenuEle.classList.contains("active_setting");
    if(isActive==false){
        settingMenuEle.classList.add("active_setting");
        let themeColorArr=document.querySelectorAll(".theme_color_box");
        let themeTypeArr=document.querySelectorAll(".theme");
        for(let i=0;i<themeColorArr.length;i++){
            themeColorArr[i].addEventListener("click",function(){
                let color=themeColorArr[i].classList[1];
                switch(color){
                    case "vibrant_green": root.style.setProperty('--themeColor','linear-gradient(to top, #0ba360 0%, #3cba92 100%)');
                                          break;
                    case "sunset_orange": root.style.setProperty('--themeColor','linear-gradient(to right, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%)');
                                          break;
                    case "ocean_blue":    root.style.setProperty('--themeColor','radial-gradient(circle 248px at center, #16d9e3 0%, #30c7ec 47%, #46aef7 100%)');
                                          break;
                }
            })
        }
        for(let i=0;i<themeTypeArr.length;i++){
            themeTypeArr[i].addEventListener("click",function(){
                let type=themeTypeArr[i].classList[1];
                if(type=="dark"){
                    root.style.setProperty('--boardColor','#001219');
                    root.style.setProperty('--textColor','rgb(241, 210, 215)');
                }else{
                    root.style.setProperty('--boardColor','white');
                    root.style.setProperty('--textColor','black');
                }
            })
        }
        isActive==false;
    }else{
        settingMenuEle.classList.remove("active_setting");
        isActive==true;
    }

})
shapeEle.addEventListener("click",function(){
    let shapeMenuEle=document.querySelector(".shape_menu");
    let shapeArr=document.querySelectorAll(".shape");
    let isActive=shapeMenuEle.classList.contains("activeFlex");
    
    if(isActive==false){
        shapeMenuEle.classList.add("activeFlex");
        isActive=true;
    }else{
        shapeMenuEle.classList.remove("activeFlex");
        isActive=false;
    }
    let clickedShape;
    for(let i=0;i<shapeArr.length;i++){
        shapeArr[i].addEventListener("click",function(){
            if(i==0){
                clickedShape="rectangle";
            }else if(i==1){
                clickedShape="circle"
            }
        })
    }
    let rect={};
    let drag=false;
    
    function drawRect(){
        tool.strokeStyle='rgba(0,0,0,0)';
        tool.fillStyle=pencilColor;
        if(clickedShape=="rectangle")
            tool.fillRect(rect.startX, rect.startY, rect.w, rect.h);
        else if(clickedShape=="circle"){
            let radius=rect.w;
            if(radius>0){
                tool.strokeStyle='rgba(0,0,0,0)';
                tool.beginPath();
                tool.arc(rect.startX, rect.startY, radius, 0, 2 * Math.PI);
                tool.fill();
            }
        }

    }
    function init(){
        board.addEventListener("mousedown",function(e){
            rect.startX=e.pageX-this.offsetLeft;
            rect.startY = e.pageY - this.offsetTop;
            drag = true;
        })
        board.addEventListener("mouseup",function(e){
            drag=false;
        })
        board.addEventListener("mousemove",function(e){
            drawingBoardEle.style.cursor="crosshair";
            if (drag) {
            rect.w = (e.pageX - this.offsetLeft) - rect.startX;
            rect.h = (e.pageY - this.offsetTop) - rect.startY ;
            drawRect();
            }
        })
    }
    init();
})
aboutEle.addEventListener("click",function(){
    let userGuideEle=document.querySelector(".user_guide_container");
    let isActive=userGuideEle.classList.contains("activeBlock");
    if(isActive==false){
        userGuideEle.classList.add("activeBlock");
        isActive=true;
    }else{
        userGuideEle.classList.remove("activeBlock");
        isActive=false;
    }
})


// *********************Helper Functions************************
function draw(pencilSize){
    if(activeTool=="pencil"){
        console.log("yes");
        drawingBoardEle.style.cursor="default";
        tool.globalCompositeOperation = "source-over";
        tool.strokeStyle=pencilColor;
        tool.lineWidth=pencilSize;
    }
    if(activeTool=="eraser"){
        drawingBoardEle.style.cursor="url('eraser.png'), auto";
        tool.globalCompositeOperation = "destination-out";
        tool.lineWidth=20;
    }
    tool.scale(zoomLevel, zoomLevel);
    let isMouseDown=false;
    board.addEventListener("mousedown",function(e){
        let x=e.clientX;
        let y=e.clientY;
        let points={
            "x":x,
            "y":y,
            "color":pencilColor,
            "size":pencilSize,
            "event":"mousedown",
            "tool":activeTool,
        }
        undoArr.push(points);
        tool.beginPath(); //this function is called before line beginning
        tool.moveTo(x,y); //to draw between the final position of mouse

        isMouseDown=true;
    })
    board.addEventListener("mousemove",function(e){
        let x=e.clientX;
        let y=e.clientY;
        if(isMouseDown==true){
            tool.lineTo(x,y);
            tool.stroke();
            let points={
                "x":x,
                "y":y,
                "color":pencilColor,
                "size":pencilSize,
                "event":"mousemove",
                "tool":activeTool,
            }
            undoArr.push(points);
        }
    })
    board.addEventListener("mouseup",function(e){
        isMouseDown=false;
    })
    
}
function createNote(){
    let colorArr=document.querySelectorAll(".note_color");
    let addNoteBtn=document.querySelector(".noteBtn");
    addNoteBtn.addEventListener("click",function(){
        let bgColor="pink";
        for(let i=0;i<colorArr.length;i++){
            if(colorArr[i].classList.contains("active_color")){
                let colorName=colorArr[i].classList[2];
                switch(colorName){
                case "cherry": bgColor="#e74c3c";
                               borderColor="#c0392b";
                               break;
                case "olive":  bgColor="#97C02F";
                               borderColor="#658E15";
                               break;
                case "skyblue":bgColor="#63cdda";
                                borderColor="#3dc1d3";
                                break;
                }

            }
        }
        let noteContainer=document.createElement("div");
        noteContainer.setAttribute("class","note_container");
        noteContainer.innerHTML=`<div class="note">
        <div class="note_header">
            <i class="fas fa-circle circle"></i>
            <i class="fas fa-circle circle"></i>
            <i class="fas fa-circle circle"></i>
            <i class="fas fa-circle circle"></i>
            <i class="fas fa-circle circle"></i>
            <i class="fas fa-circle circle"></i>
            <i class="fas fa-circle circle"></i>
            <i class="fas fa-circle circle"></i>
        </div>
        <div class="note_content" contenteditable="true"></div>
        <i class="fas fa-trash-alt note_delete"></i>
                        </div>`;
        // console.log("->",noteContainer.children[0]);
        let note=noteContainer.children[0];
        note.style.backgroundColor=bgColor;
        // let styleElem=note.appendChild(document.createElement("style"));
        // styleElem.innerHTML=`.note::before{border-color:${borderColor} #fff;}`;
        drawingBoardEle.appendChild(noteContainer);
        //  dragTheNote();
        let noteArr=document.querySelectorAll(".note_container");
        for(let i=0;i<noteArr.length;i++){
            noteArr[i].addEventListener("click",dragTheNote(noteArr[i]));
        }
        let noteDelBtn=document.querySelector(".note_delete");
        noteDelBtn.addEventListener("click",function(){
            noteContainer.remove();
        })
        

    });
}
function dragTheNote(element){
    // tool.strokeStyle = 'rgba(0,0,0,0)';
    // tool.fillStyle = 'rgba(0,0,0,0)';
        let note=element.querySelector(".note");
        let active=false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xoffset=0;
        let yoffset=0;
        drawingBoardEle.style.cursor="move";
        drawingBoardEle.addEventListener("mousedown",dragStart,false);
        drawingBoardEle.addEventListener("mouseup",dragEnd,false);
        drawingBoardEle.addEventListener("mousemove",drag,false);
        function dragStart(e){
            
            // clientX and clientY will return the exact cordinates of the point we click with mouse
            initialX=e.clientX-xoffset;
            initialY=e.clientY- yoffset;
            // so that only note gets drag
            if(e.target === note){
                active=true;
                // console.log("true");
            }
        }
        function drag(e){
            // e.preventDefault();
            if(active){
                tool.strokeStyle = 'rgba(0,0,0,0)';
                currentX=e.clientX-initialX;
                currentY=e.clientY-initialY;

                xoffset=currentX;
                yoffset=currentY;
                setTranslate(currentX,currentY,note);
            }
        }
        function setTranslate(currentX,currentY,note){
            note.style.transform="translate3d(" + currentX + "px, " + currentY + "px, 0)";
        }
        function dragEnd(e){
            
            initialX=currentX;
            initialY=currentY;
            active=false;
            if(drawingBoardEle.style.cursor=="move")
                drawingBoardEle.style.cursor="default";
        }
}
function redraw(undoArr){
    
    tool.clearRect(0,0,board.width,board.height);
    for(let i=0;i<undoArr.length;i++){
        tool.strokeStyle=undoArr[i].color;
        tool.lineWidth=undoArr[i].size;
        if(undoArr[i].event=="mousedown"){
            tool.beginPath(); //this function is called before line beginning
            tool.moveTo(undoArr[i].x,undoArr[i].y);
        }
        if(undoArr[i].event=="mousemove"){
            tool.lineTo(undoArr[i].x,undoArr[i].y);
            tool.stroke();
        }
    }    
        
}
function drawImg(img){
    // resize the image
    let maxSize=500;
    let width=img.width;
    let height=img.height;
    if(width>height){
        if(width>maxSize){
            height*=maxSize/width;
            width=maxSize;
        }
    }else{
        if(height>maxSize){
            width*=maxSize/height;
            height=maxSize;
        }
    }

    // board.width=width;
    // board.height=height;
    tool.drawImage(img,150,150,width,height);
}
function failImg(){
    console.error("Image can't be loaded");
}