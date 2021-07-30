function moreBtn(){
    let inviteBtn=document.getElementsByClassName("inviteBtn")
    let deleteGroupBtn=document.getElementsByClassName("deleteGroupBtn")
    let n=0
    if (inviteBtn[0].style.display == "flex") {
        deleteGroupBtn[0].style.display="none"
        while(n<inviteBtn.length){
            inviteBtn[n].style.display="none"
            n+=1
        }
    } else {
        deleteGroupBtn[0].style.display="flex"
        while(n<inviteBtn.length){
            inviteBtn[n].style.display="flex"
            n+=1
        }
    }

    
}


function hamclick(){
    let headRight=document.getElementById("headRight")
    if (headRight.style.display == "flex") {
        headRight.style.display = "none";
    } else {
        headRight.style.display = "flex";
    }
}

function chatroomWindow(){
    let chatroom=document.getElementById("chatroom")
    chatroom.classList.toggle("display")
}

function addTime(btn){
    let startTime=btn.parentNode.childNodes[0].value
    let endTime=btn.parentNode.childNodes[1].value
    let content=btn.parentNode.childNodes[2].value
    let scheduleLen=btn.parentNode.parentNode.childNodes[3].childNodes.length
    let thisCardId=btn.parentNode.parentNode.id[5]
    if(startTime=="未選擇"|endTime=="未選擇"|content==""){
        alert("請選擇時間及行程")
    }else if(startTime>=endTime){
        alert("結束時間需大於開始時間")
    }else{
        let Bodydiv=document.getElementsByClassName("cardBody")[thisCardId]
        let schedulediv=document.createElement("div")
        let Timediv=document.createElement("div")
        let Contentdiv=document.createElement("input")
        let mapBtndiv=document.createElement("div")
        schedulediv.classList.add("schedule")
        Timediv.classList.add("scheduleTime")
        Contentdiv.classList.add("scheduleContent")
        mapBtndiv.classList.add("mapBtn")
        mapBtndiv.classList.add("mymouse")
        mapBtndiv.setAttribute("onclick","maptext(this)")
        mapBtndiv.textContent="地圖"
        Contentdiv.setAttribute("type","text")
        Timediv.textContent=startTime+"-"+endTime
        Contentdiv.value=content
        Contentdiv.setAttribute("id","Content_"+thisCardId+"_"+scheduleLen)
        Bodydiv.appendChild(schedulediv)
        schedulediv.appendChild(Timediv)
        schedulediv.appendChild(Contentdiv)
        schedulediv.appendChild(mapBtndiv)
    }
}

function maptext(place){
    let text=place.parentNode.childNodes[1].value

    if(text!=""){
        let par=place.parentNode.parentNode.parentNode
        let mapBar=place.parentNode.parentNode.parentNode.childNodes[1]
        let child=place.parentNode.parentNode.parentNode.childNodes[1]
        child.innerHTML=""
        let bodydiv=place.parentNode.parentNode
        let googlemapDiv=document.createElement("iframe")
        googlemapDiv.src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBNcfVaqd1lZVOYcKnriraVgBc0lv-o8eU&q="+text
        googlemapDiv.classList.add("googlemap")
        mapBar.appendChild(googlemapDiv)
    }    
}

function deleteGroup(){
    let groupId=location.pathname.split("/")[2]
    let deleteGroupreq=new XMLHttpRequest();
    deleteGroupreq.open("delete","/api/addgroup");
    deleteGroupreq.onload=function(){
        Result=JSON.parse(this.responseText);
        alert(Result["message"])
        window.location.href='/'
    }
    deleteGroupreq.send(JSON.stringify({"groupId":groupId}))
}

function deleteGroupWindow(){
    let deleteGroup=document.getElementById("deleteGroup")
    let windowBackground=document.getElementById("windowBackground")
    deleteGroup.classList.remove("display")
    windowBackground.classList.remove("display")
}


function deleteMember(){
    let loading=document.getElementById("loading")
    loading.classList.remove("display") 
    let groupId=location.pathname.split("/")[2]
    let deleteMemberreq=new XMLHttpRequest();
    deleteMemberreq.open("delete","/api/inviteMember");
    deleteMemberreq.onload=function(){
        Result=JSON.parse(this.responseText);
        alert(Result["message"])
        window.location.reload()
    }
    deleteMemberreq.send(JSON.stringify({"mail":deletethisMember,"groupId":groupId}))
}
function deleteMemberWindow(thisMember){
    deletethisMember=thisMember.parentNode.childNodes[2].textContent
    let deleteMember=document.getElementById("deleteMember")
    let windowBackground=document.getElementById("windowBackground")
    let Member=document.getElementById("Member")
    let deleteMembermail=document.getElementById("deleteMembermail")
    deleteMembermail.textContent=deletethisMember
    Member.classList.add("display")
    deleteMember.classList.remove("display")
    windowBackground.classList.remove("display")
}

function deleteSchedule(){
    let scheduleId=deleteObj.childNodes[0].childNodes[0].textContent
    let groupId=location.pathname.split("/")[2]
    let deletecardreq=new XMLHttpRequest();
    let loading=document.getElementById("loading")
    loading.classList.remove("display") 
    deletecardreq.open("delete","/api/addcard");
    deletecardreq.onload=function(){
        alert("行程已刪除")
        window.location.reload()
        loading.classList.add("display") 
    }
    deletecardreq.send(JSON.stringify({"scheduleId":scheduleId,"groupId":groupId}))
}

function deleteScheduleWindow(myObj){
    deleteObj=myObj.parentNode.parentNode
    let deleteCard=document.getElementById("deleteCard")
    let windowBackground=document.getElementById("windowBackground")
    windowBackground.classList.remove("display")
    deleteCard.classList.remove("display")
}

function addMember(){
    let inviteEmail=document.getElementById("inviteEmail").value
    let loading=document.getElementById("loading")
    loading.classList.remove("display")
    let groupId=location.pathname.split("/")[2]
    if (inviteEmail.indexOf("@")>=0){
        let invitedatareq=new XMLHttpRequest();
        invitedatareq.open("post","/api/inviteMember");
        invitedatareq.onload=function(){
            Result=JSON.parse(this.responseText);
            alert(Result["message"])
            window.location.reload()
        }
        invitedatareq.send(JSON.stringify({"mail":inviteEmail,"groupId":groupId}))
 
    }else{
        alert("請輸入電子信箱")
    }
}


function memberWindow(){
    let Member=document.getElementById("Member")
    let windowBackground=document.getElementById("windowBackground")
    Member.classList.remove("display")
    windowBackground.classList.remove("display")
}

function invite(){
    let inviteMember=document.getElementById("inviteMember")
    let windowBackground=document.getElementById("windowBackground")
    inviteMember.classList.remove("display")
    windowBackground.classList.remove("display")
}

function saveSchedule(){
    let loading=document.getElementById("loading")
    loading.classList.remove("display") 
    let groupName=document.getElementById("groupName").value
    let groupId=location.pathname.split("/")[2]
    let scheduleId=[]
    let sendData={
        "email": "test@test.test",
        "groupName": groupName,
        "groupId": groupId
    }
    let m=0
    let scheduleLen=document.getElementsByClassName("scheduleId").length
    while(m<scheduleLen){
        if(document.getElementById("place_"+m)==null){
            m+=1
            scheduleLen+=1
        }else{
            let schedule_Id=document.getElementById("id_"+m).textContent
            let place=document.getElementById("place_"+m).textContent
            let date=document.getElementById("date_"+m).textContent
            scheduleId.push(schedule_Id)
            let scheduleDir={}
            let scheduleTime=[]
            scheduleDir["place"]=place
            scheduleDir["date"]=date

            let n=0
            let thisCardscheduleLen=document.getElementById("Content_"+m+"_0").parentNode.parentNode.childNodes.length
            while(n<thisCardscheduleLen){
                let content=document.getElementById("Content_"+m+"_"+n)
                let time=content.parentNode.childNodes[0]
                if(content.value!=""){
                    scheduleDir[time.textContent]=content.value
                    scheduleTime.push(time.textContent)
                    n+=1
                }else{
                    n+=1
                }
            }
            scheduleDir["scheduleTime"]=scheduleTime
            sendData[schedule_Id]=scheduleDir
            m+=1
        }
    }
    sendData["scheduleId"]=scheduleId
    let savedatareq=new XMLHttpRequest();
    savedatareq.open("post","/api"+location.pathname);
    savedatareq.onload=function(){
        saveResult=JSON.parse(this.responseText);
        alert(saveResult["message"])
        loading.classList.add("display") 
    }
    savedatareq.send(JSON.stringify({"data":sendData}))
}


function chatroomData(){
    let getchatroomreq=new XMLHttpRequest();
    getchatroomreq.open("get","/api/chatroom/"+location.pathname);
    getchatroomreq.onload=function(){
        groupData=JSON.parse(this.responseText);
        chatroomDataLen=groupData["chatroom"].length
        if (groupData["chatroom"][0][0]!=null){
            let x=0
            while(x<chatroomDataLen){
                // create div
                let chatroomBody=document.getElementById("chatroomBody")
                let CloudDiv=document.createElement("div")
                let NameDiv=document.createElement("div")
                let ContentDiv=document.createElement("div")
                // add class
                CloudDiv.classList.add("chatCloud")
                NameDiv.classList.add("chatName")
                ContentDiv.classList.add("chatContent")
                // add textcontent
                NameDiv.textContent=groupData["chatroom"][x][0]
                ContentDiv.textContent=groupData["chatroom"][x][1]
                // append html
                chatroomBody.appendChild(CloudDiv)
                CloudDiv.appendChild(NameDiv)
                CloudDiv.appendChild(ContentDiv)
                x+=1
            }
        }
    }
    getchatroomreq.send()
}

function groupMember(){
    let groupMemberreq=new XMLHttpRequest();
    groupMemberreq.open("get","/api/groupmember/"+location.pathname);
    groupMemberreq.onload=function(){
        groupData=JSON.parse(this.responseText);
        let Member=document.getElementById("Member")
        let memberLen=0
        while(memberLen<groupData["email"].length){
            let memberDiv=document.createElement("div")
            let nameDiv=document.createElement("div")
            let mailDiv=document.createElement("div")
            let deleteDiv=document.createElement("div")
            memberDiv.classList.add("groupMember")
            nameDiv.classList.add("memberName")
            mailDiv.classList.add("memberEmail")
            deleteDiv.classList.add("deleteMemberImg")
            deleteDiv.classList.add("mymouse")
            deleteDiv.setAttribute("onclick","deleteMemberWindow(this)")
            nameDiv.textContent=groupData["member"][groupData["email"][memberLen]]
            mailDiv.textContent=groupData["email"][memberLen]
            Member.appendChild(memberDiv)
            memberDiv.appendChild(deleteDiv)
            memberDiv.appendChild(nameDiv)
            memberDiv.appendChild(mailDiv)
            memberLen+=1
        }
    }
    groupMemberreq.send()
}


let getdatareq=new XMLHttpRequest();
getdatareq.open("get","/api/"+location.pathname);
getdatareq.onload=function(){
    groupData=JSON.parse(this.responseText);
    if(groupData["data"]=="無權限觀看此看板"){
        alert("無權限觀看此看板")
        window.location.href='/'
    }else{
        // 行程html
        let groupName=document.getElementById("groupName")
        let centerLeft=document.getElementById("centerLeft")
        let m=0
        while(m<groupData["data"]["scheduleId"].length){
            let scheduleId=groupData["data"]["scheduleId"][m]
            groupName.value=groupData["data"]["groupName"]
            let cardPlace=groupData["data"][scheduleId]["place"]
            let cardDate=groupData["data"][scheduleId]["date"]
            // create div 
            let div=document.createElement("div")
            let Topdiv=document.createElement("div")
            let Placediv=document.createElement("div")
            let Datediv=document.createElement("div")
            let Weatherdiv=document.createElement("div")
            let Bodydiv=document.createElement("div")
            let iddiv=document.createElement("div")
            let deleteBtn=document.createElement("div")
            let mapBarDiv=document.createElement("div")
            let choseDiv=document.createElement("div")
            let choseTime=document.createElement("select")
            let endTime=document.createElement("select")
            let choseText=document.createElement("input")
            let choseBtn=document.createElement("div")
            choseBtn.setAttribute("onclick","addTime(this)")
            // 時間下拉選單
            let chose=document.createElement("option")
            chose.setAttribute("value","未選擇")
            choseTime.setAttribute("id","startTime_"+m)
            chose.textContent="開始時間"
            choseTime.appendChild(chose)
            for(let n=0;n<25;n++){
                let chose=document.createElement("option")
                if(n<10){
                    chose.textContent="0"+n+":00"
                }else{
                    chose.textContent=n+":00"
                }
                chose.setAttribute("value",chose.textContent)
                choseTime.appendChild(chose)
            }
            let endchose=document.createElement("option")
            endchose.setAttribute("value","未選擇")
            endTime.setAttribute("id","endTime_"+m)
            endchose.textContent="結束時間"
            endTime.appendChild(endchose)
            for(let n=0;n<25;n++){
                let chose=document.createElement("option")
                if(n<10){
                    chose.textContent="0"+n+":00"
                }else{
                    chose.textContent=n+":00"
                }
                chose.setAttribute("value",chose.textContent)
                endTime.appendChild(chose)
            }
            
            // 設定id
            div.setAttribute("id","card_"+m)
            Placediv.setAttribute("id","place_"+m)
            Datediv.setAttribute("id","date_"+m)
            iddiv.setAttribute("id","id_"+m)
            deleteBtn.setAttribute("id","delete_"+m)
            Weatherdiv.setAttribute("id","weather_"+m)
            deleteBtn.setAttribute("onclick","deleteScheduleWindow(this)")
            mapBarDiv.setAttribute("id","mapBar_"+m)
            choseText.setAttribute("type","text")

            // dom 文字更改
            Placediv.textContent=cardPlace
            Datediv.textContent=cardDate
            iddiv.textContent=scheduleId
            choseBtn.textContent="送出"

            // add class
            div.classList.add("card")
            Topdiv.classList.add("cardTop")
            Placediv.classList.add("tripPlace")
            Datediv.classList.add("tripDate")
            Bodydiv.classList.add("cardBody")
            iddiv.classList.add("scheduleId")
            deleteBtn.classList.add("deleteBtn")
            deleteBtn.classList.add("mymouse")
            mapBarDiv.classList.add("mapBar")
            choseDiv.classList.add("chose")
            choseTime.classList.add("choseTime")
            endTime.classList.add("choseTime")
            choseText.classList.add("choseText")
            choseBtn.classList.add("choseBtn")
            choseBtn.classList.add("mymouse")
            // html
            centerLeft.appendChild(div)
            div.appendChild(Topdiv)
            div.appendChild(mapBarDiv)
            div.appendChild(choseDiv)
            choseDiv.appendChild(choseTime)
            choseDiv.appendChild(endTime)
            choseDiv.appendChild(choseText)
            choseDiv.appendChild(choseBtn)
            div.appendChild(Bodydiv)
            Topdiv.appendChild(iddiv)
            Topdiv.appendChild(Placediv)
            Topdiv.appendChild(Datediv)
            Weatherdiv.textContent=groupData["data"][scheduleId]["weather"]
            Weatherdiv.classList.add("tripWeather")
            Topdiv.appendChild(Weatherdiv)
            Topdiv.appendChild(deleteBtn)

            // 行程
            let scheduleLen=groupData["data"][scheduleId]["scheduleTime"]
            let scheduleTime=groupData["data"][scheduleId]["scheduleTime"].sort()
            let n=0
            while(n<scheduleLen.length){
                let schedulediv=document.createElement("div")
                let Timediv=document.createElement("div")
                let Contentdiv=document.createElement("input")
                let mapBtndiv=document.createElement("div")
                schedulediv.classList.add("schedule")
                Timediv.classList.add("scheduleTime")
                Contentdiv.classList.add("scheduleContent")
                mapBtndiv.classList.add("mapBtn")
                mapBtndiv.classList.add("mymouse")
                mapBtndiv.setAttribute("onclick","maptext(this)")
                mapBtndiv.textContent="地圖"
                Contentdiv.setAttribute("type","text")
                Timediv.textContent=scheduleTime[n]
                Contentdiv.value=groupData["data"][scheduleId][scheduleTime[n]]
                Contentdiv.setAttribute("id","Content_"+m+"_"+n)
                Bodydiv.appendChild(schedulediv)
                schedulediv.appendChild(Timediv)
                schedulediv.appendChild(Contentdiv)
                schedulediv.appendChild(mapBtndiv)
                schedulediv.appendChild(mapBtndiv)
                n+=1
            }
            m+=1
        }
    }

    let loading=document.getElementById("loading")
    loading.classList.add("display") 
    chatroomData()
    groupMember()
    let weatherData={}
    let n=0
    while (n<groupData["data"]["scheduleId"].length){

        let scheduleData={}
        scheduleData["date"]=groupData["data"][groupData["data"]["scheduleId"][n]]["date"]
        scheduleData["place"]=groupData["data"][groupData["data"]["scheduleId"][n]]["place"]
        weatherData[n]=scheduleData
        n+=1
    }
    // 天氣資訊
    let getweatherreq=new XMLHttpRequest();
    getweatherreq.open("post","/api/weather");
    getweatherreq.onload=function(){
        let weatherdata=JSON.parse(this.responseText);
        let n=0
        while(n<Object.keys(weatherdata["data"]).length){
            let weatherId=document.getElementById("weather_"+n)
            weatherId.textContent=weatherdata["data"][n]["weather"]
            n+=1
        }
    }
    getweatherreq.send(JSON.stringify({"data":weatherData}))
}
getdatareq.send()


function schedule(){
    let n=0
    while(n<=23){
        let dayOne=document.getElementById("dayOne")
        let schedulediv=document.createElement("div")
        let Timediv=document.createElement("div")
        let Contentdiv=document.createElement("input")
        schedulediv.classList.add("schedule")
        Timediv.classList.add("scheduleTime")
        Contentdiv.classList.add("scheduleContent")
        Contentdiv.setAttribute("type","text")
        if(n<=8){
            Timediv.textContent="0"+n+":00-0"+(n+1)+":00"
            Contentdiv.textContent="456"
            dayOne.appendChild(schedulediv)
            schedulediv.appendChild(Timediv)
            schedulediv.appendChild(Contentdiv)
            n+=1
        }else if(n==9){
            Timediv.textContent="0"+n+":00-"+(n+1)+":00"
            Contentdiv.textContent="456"
            dayOne.appendChild(schedulediv)
            schedulediv.appendChild(Timediv)
            schedulediv.appendChild(Contentdiv)
            n+=1
        }else if(n==23){
            Timediv.textContent=n+":00-00:00"
            Contentdiv.textContent="456"
            dayOne.appendChild(schedulediv)
            schedulediv.appendChild(Timediv)
            schedulediv.appendChild(Contentdiv)
            n+=1
        }else{
            Timediv.textContent=n+":00-"+(n+1)+":00"
            Contentdiv.textContent="456"
            dayOne.appendChild(schedulediv)
            schedulediv.appendChild(Timediv)
            schedulediv.appendChild(Contentdiv)
            n+=1
        }
    }
}
function addCard(){
    let loading=document.getElementById("loading")
    loading.classList.remove("display")
    let centerLeft=document.getElementById("centerLeft")
    let cardPlace=document.getElementById("cardPlace").value
    let cardDate=document.getElementById("cardDate").value
    let groupId=location.pathname.split("/")[2]

    let addcardreq=new XMLHttpRequest();
    addcardreq.open("post","/api/addcard");
    addcardreq.onload=function(){
        window.location.reload()
    }
    addcardreq.send(JSON.stringify({"place":cardPlace,"date":cardDate,"groupId":groupId}))


 
}

function addCardWindow(){
    let addCard=document.getElementById("addCard")
    let windowBackground=document.getElementById("windowBackground")
    addCard.classList.remove("display");
    windowBackground.classList.remove("display");
}

//確認使用者登入狀態 
function checkMember(){
        let reqMember=new XMLHttpRequest();
        reqMember.open("get","/api/schedule/user")
        reqMember.onload=function(){
            let getdata=JSON.parse(this.responseText);
            let signInbtn=document.getElementById("signInbtn")
            let signOutbtn=document.getElementById("signOutbtn")
            if(getdata["data"]!=null){
                signInbtn.classList.add("display")
                signOutbtn.classList.remove("display")
            }else{
                alert("您無權觀看此群組")
                window.location.href='/'
                signInbtn.classList.remove("display")
                signOutbtn.classList.add("display")
            }
        }
        reqMember.send()
}

//登出
function signOut(){
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    });

    let reqsignOut=new XMLHttpRequest()
    reqsignOut.open("delete","/api/user")
    reqsignOut.onload=function(){
        let signInbtn=document.getElementById("signInbtn")
        let signOutbtn=document.getElementById("signOutbtn")
        window.location.reload()
        signInbtn.classList.remove("display")
        signOutbtn.classList.add("display")
        
    }
    reqsignOut.send()
}    
// 登入
function signIn(){
    let signineMail=document.getElementById("signinEmail").value
    let signinPassword=document.getElementById("signinPassword").value
    let signinError=document.getElementById("signinError")
    if(signineMail==""|signinPassword==""){
        signinError.classList.remove("display")
    }else{
        let reqsignIn=new XMLHttpRequest()
        reqsignIn.open("post","/api/user")
        reqsignIn.onload=function(){
            signindata=JSON.parse(this.responseText);
            if (signindata["ok"]==true){
                window.location.reload()
            }else{
                signinError.classList.remove("display")
            }
            
        }
        reqsignIn.send(JSON.stringify({"email":signineMail,"password":signinPassword}))
    }
}  
//註冊
function signUp(){
    let signupName=document.getElementById("signupName").value
    let signupMail=document.getElementById("signupEmail").value
    let signupPassword=document.getElementById("signupPassword").value
    let signupemailError=document.getElementById("signupemailError")
    let signupspaceError=document.getElementById("signupspaceError")
    // 判斷input是否空白
    if(signupName==""| signupMail==""| signupPassword==""){
        signupspaceError.classList.remove("display")
    }else{
        // 連接註冊API
        let reqsignUp=new XMLHttpRequest();
        reqsignUp.open("post","/api/user")
        reqsignUp.onload=function(){
            signupdata=JSON.parse(this.responseText);
            if(signupdata["ok"]==true){
                //註冊成功則自動登入
                let reqsignIn=new XMLHttpRequest()
                reqsignIn.open("post","/api/user")
                reqsignIn.onload=function(){
                    signindata=JSON.parse(this.responseText);
                    if (signindata["ok"]==true){
                        window.location.reload()
                    }else{
                        let signinError=document.getElementById("signinError")
                        signinError.classList.remove("display")
                    }
                    
                }
                reqsignIn.send(JSON.stringify({"email":signupMail,"password":signupPassword}))
            }else{
                // 註冊失敗顯示原因
                signupspaceError.classList.add("display")
                signupemailError.classList.remove("display")
            }
        }
        reqsignUp.send(JSON.stringify({"name":signupName,"email":signupMail,"password":signupPassword}))

    }
}

// 登入視窗
function signinWindow(){
    let signIn=document.getElementById("signIn");
    let signUp=document.getElementById("signUp");
    let windowBackground=document.getElementById("windowBackground")
    let signinError=document.getElementById("signinError")
    let signupspaceError=document.getElementById("signupspaceError")
    let signupemailError=document.getElementById("signupemailError")
    windowBackground.classList.remove("display");
    signUp.classList.add("display");
    signIn.classList.remove("display");
    // 隱藏錯誤訊息
    signinError.classList.add("display");
    signupspaceError.classList.add("display");
    signupemailError.classList.add("display");
}
function signupWindow(){
    let signIn=document.getElementById("signIn");
    let signUp=document.getElementById("signUp");
    let signupspaceError=document.getElementById("signupspaceError")
    let signupemailError=document.getElementById("signupemailError")
    windowBackground.classList.remove("display");
    signUp.classList.remove("display");
    signIn.classList.add("display");
    // 隱藏錯誤訊息
    signinError.classList.add("display");
    signupspaceError.classList.add("display");
    signupemailError.classList.add("display");
}
function closeWindow(){
    let signIn=document.getElementById("signIn");
    let signUp=document.getElementById("signUp");
    let addCard=document.getElementById("addCard")
    let signupspaceError=document.getElementById("signupspaceError")
    let signupemailError=document.getElementById("signupemailError")
    let inviteMember=document.getElementById("inviteMember")
    let Member=document.getElementById("Member")
    let deleteCard=document.getElementById("deleteCard")
    let deleteMember=document.getElementById("deleteMember")
    let deleteGroup=document.getElementById("deleteGroup")
    windowBackground.classList.add("display");
    signUp.classList.add("display");
    signIn.classList.add("display");
    addCard.classList.add("display");
    inviteMember.classList.add("display")
    Member.classList.add("display")
    deleteCard.classList.add("display")
    deleteMember.classList.add("display")
    deleteGroup.classList.add("display")
    // 隱藏錯誤訊息
    signupspaceError.classList.add("display");
    signupemailError.classList.add("display");
}


let socket = io();
function sendmessage(){
    let chatroomText=document.getElementById("chatroomText").value
    let socket = io.connect();
    socket.on('connect',function(){
        let groupId=location.pathname.split("/")[2]
        socket.emit('my send',{"content":chatroomText,"groupId":groupId})
        document.getElementById("chatroomText").value=null
    })
}



socket.on("my change",function(msg){
    // create div
    let chatroomBody=document.getElementById("chatroomBody")
    let CloudDiv=document.createElement("div")
    let NameDiv=document.createElement("div")
    let ContentDiv=document.createElement("div")
    // add class
    CloudDiv.classList.add("chatCloud")
    NameDiv.classList.add("chatName")
    ContentDiv.classList.add("chatContent")
    // add textcontent
    NameDiv.textContent=msg["member"]
    ContentDiv.textContent=msg["content"]
    // append html
    chatroomBody.appendChild(CloudDiv)
    CloudDiv.appendChild(NameDiv)
    CloudDiv.appendChild(ContentDiv)
})