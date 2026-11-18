"use strict";
const passwordInput=document.getElementById("passwordInput");
const rules=[
{id:"lengthCheck",label:"At least 12 characters",test:v=>v.length>=12},
{id:"upperCheck",label:"Uppercase letter",test:v=>/[A-Z]/.test(v)},
{id:"lowerCheck",label:"Lowercase letter",test:v=>/[a-z]/.test(v)},
{id:"numberCheck",label:"Number",test:v=>/[0-9]/.test(v)},
{id:"symbolCheck",label:"Special character",test:v=>/[^A-Za-z0-9]/.test(v)},
{id:"varietyCheck",label:"No simple repeated pattern",test:v=>!/(.)\\1{2,}/.test(v)&&!/^(123|abc|qwerty)/i.test(v)}
];
function analyzePassword(value){return rules.map(rule=>({...rule,passed:rule.test(value)}));}
function showAnalysis(){
 const value=passwordInput.value;
 if(!value){resetAnalysis();return;}
 const results=analyzePassword(value),score=results.filter(r=>r.passed).length;
 results.forEach(r=>{const el=document.getElementById(r.id);el.textContent=(r.passed?"✓ ":"✕ ")+r.label;el.className=r.passed?"pass":"fail";});
 let level="Weak",message="Add more variety and use a longer password.",kind="weak";
 if(score>=5){level="Strong";message="Good result. Keep this password unique to one account.";kind="strong";}
 else if(score>=3){level="Medium";message="Improve the missing checks to make it stronger.";kind="medium";}
 document.getElementById("strengthText").textContent="Strength: "+level;
 document.getElementById("scoreText").textContent=score+" / 6";
 document.getElementById("meterFill").style.width=(score/6*100)+"%";
 document.getElementById("meterFill").style.background=score>=5?"#159b68":score>=3?"#d69a20":"#d93658";
 const card=document.getElementById("resultCard");card.className="result "+kind;
 document.getElementById("resultTitle").textContent="Your password is "+level.toLowerCase()+".";
 document.getElementById("resultMessage").textContent=message;
}
function resetAnalysis(){
 document.getElementById("strengthText").textContent="Strength: Not checked";
 document.getElementById("scoreText").textContent="0 / 6";
 document.getElementById("meterFill").style.width="0%";
 const card=document.getElementById("resultCard");card.className="result neutral";
 document.getElementById("resultTitle").textContent="Start typing to see your password analysis.";
 document.getElementById("resultMessage").textContent="Use a sample password for your demonstration.";
 rules.forEach(r=>{const el=document.getElementById(r.id);el.textContent="○ "+r.label;el.className="";});
}
function randomIndex(max){const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%max;}
function generatePassword(){
 const length=Number(document.getElementById("lengthSlider").value),groups=[];
 if(document.getElementById("includeUpper").checked)groups.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
 if(document.getElementById("includeLower").checked)groups.push("abcdefghijklmnopqrstuvwxyz");
 if(document.getElementById("includeNumbers").checked)groups.push("0123456789");
 if(document.getElementById("includeSymbols").checked)groups.push("!@#$%&*+-_?");
 const out=document.getElementById("generatedPassword"),msg=document.getElementById("generatorMessage");
 if(!groups.length){out.textContent="Select at least one character group.";msg.textContent="No character groups selected.";return;}
 let value="";groups.forEach(g=>value+=g[randomIndex(g.length)]);
 const all=groups.join("");while(value.length<length)value+=all[randomIndex(all.length)];
 const chars=value.split("");for(let i=chars.length-1;i>0;i--){const j=randomIndex(i+1);[chars[i],chars[j]]=[chars[j],chars[i]];}
 out.textContent=chars.join("");msg.textContent="Generated locally in this browser.";
}
document.getElementById("checkButton").addEventListener("click",showAnalysis);
passwordInput.addEventListener("input",showAnalysis);
document.getElementById("togglePassword").addEventListener("click",e=>{
 const hidden=passwordInput.type==="password";passwordInput.type=hidden?"text":"password";e.target.textContent=hidden?"Hide":"Show";
});
document.getElementById("clearButton").addEventListener("click",()=>{passwordInput.value="";resetAnalysis();});
document.getElementById("lengthSlider").addEventListener("input",e=>document.getElementById("lengthValue").textContent=e.target.value);
document.getElementById("generateButton").addEventListener("click",generatePassword);
document.getElementById("generateQuick").addEventListener("click",()=>{generatePassword();const v=document.getElementById("generatedPassword").textContent;if(v&&!v.startsWith("Select")){passwordInput.value=v;showAnalysis();}});
document.getElementById("copyButton").addEventListener("click",async()=>{
 const v=document.getElementById("generatedPassword").textContent,msg=document.getElementById("generatorMessage");
 if(!v||v.startsWith("Your generated")||v.startsWith("Select")){msg.textContent="Generate a password first.";return;}
 try{await navigator.clipboard.writeText(v);msg.textContent="Password copied.";}
 catch(err){msg.textContent="Clipboard unavailable. Select and copy manually.";}
});
resetAnalysis();