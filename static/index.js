function hamclick(){
    let headRight=document.getElementById("headRight")
    if (headRight.style.display == "flex") {
        headRight.style.display = "none";
    } else {
        headRight.style.display = "flex";
    }
}
function handleCredentialResponse(response) {
    let sub=response.credential
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/tokensignin');
    xhr.onload = function() {
        let googledata=JSON.parse(this.responseText);
        if(googledata["google"]=="GET"){
        }else{
            window.location.reload()
        }
    };
    xhr.send(JSON.stringify({"idtoken":sub}));
}
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var id_token = googleUser.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/tokensignin');
    xhr.onload = function() {
        let googledata=JSON.parse(this.responseText);
        if(googledata["google"]=="GET"){
        }else{
            window.location.reload()
        }
    };
    xhr.send(JSON.stringify({"idtoken":id_token,"CLIENT_ID":profile.getId(),"email":profile.getEmail(),"name":profile.getName()}));
}
function choseGroup(thisCard){
    let groupId=thisCard.childNodes[1].textContent
    document.location.href="/schedule/"+groupId
}
function addGroup(){
    let addGroupreq=new XMLHttpRequest();
    addGroupreq.open("post","/api/addgroup")
    addGroupreq.onload=function(){
        let groupdata=JSON.parse(this.responseText);
        document.location.href="/schedule/"+groupdata["groupId"]
    }
    addGroupreq.send()
}
//確認使用者登入狀態 
function checkMember(){
        let reqMember=new XMLHttpRequest();
        reqMember.open("get","/api/user")
        reqMember.onload=function(){
            let getdata=JSON.parse(this.responseText);
            let signInbtn=document.getElementById("signInbtn")
            let signOutbtn=document.getElementById("signOutbtn")
            let newGroup=document.getElementById("newGroup")
            let signIn_btn=document.getElementById("signIn_btn")
            let signUp_btn=document.getElementById("signUp_btn")
            if(getdata["data"]!=null){
                signInbtn.classList.add("display")
                signOutbtn.classList.remove("display")
                signIn_btn.classList.add("display")
                signUp_btn.classList.add("display")
                newGroup.classList.remove("display")
                if(getdata["data"]["groupId"]!=null){
                    let groupLen=getdata["data"]["groupId"].length
                    let n=0
                    while(n<groupLen){
                        let div=document.createElement("div")
                        let btnPar=document.getElementById("btnPar")
                        let iddiv=document.createElement("div")
                        div.setAttribute("onclick","choseGroup(this)")
                        iddiv.classList.add("scheduleId")
                        div.classList.add("sign_btn")
                        div.classList.add("mymouse")
                        div.textContent=getdata["data"]["groupData"][getdata["data"]["groupId"][n]]
                        iddiv.textContent=getdata["data"]["groupId"][n]
                        btnPar.appendChild(div)
                        div.appendChild(iddiv)
                        n+=1
                    }
                }
            }
            let loading=document.getElementById("loading")
            loading.classList.add("display") 
        }
        reqMember.send()
}
//登出
function signOut(){
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
    let signupspaceError=document.getElementById("signupspaceError")
    let signupemailError=document.getElementById("signupemailError")
    windowBackground.classList.add("display");
    signUp.classList.add("display");
    signIn.classList.add("display");
    // 隱藏錯誤訊息
    signupspaceError.classList.add("display");
    signupemailError.classList.add("display");
}