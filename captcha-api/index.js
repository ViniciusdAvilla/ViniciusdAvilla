// No database or consent collection: Google reCAPTCHA v2 challenge verification only.
const http=require('node:http'), https=require('node:https');
const PORT=Number(process.env.PORT||10000);
const origin='https://ethos-tribo-autorizacao.onrender.com';
const secret=process.env.RECAPTCHA_SECRET||'';
function send(res,code,body,requestOrigin){res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff', ...(requestOrigin===origin?{'Access-Control-Allow-Origin':origin,'Vary':'Origin'}:{})});res.end(JSON.stringify(body))}
http.createServer((req,res)=>{
 const requestOrigin=req.headers.origin;
 if(req.method==='GET'&&req.url==='/health')return send(res,200,{ok:true,configured:!!secret},requestOrigin);
 if(req.method==='OPTIONS'&&req.url==='/verify'){res.writeHead(requestOrigin===origin?204:403,{'Access-Control-Allow-Origin':requestOrigin===origin?origin:'null','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600'});return res.end()}
 if(req.url!=='/verify'||req.method!=='POST')return send(res,404,{error:'Not found'},requestOrigin);
 if(requestOrigin!==origin)return send(res,403,{verified:false},requestOrigin);
 if(!secret)return send(res,503,{verified:false,error:'reCAPTCHA not configured'},requestOrigin);
 let body='';req.on('data',c=>{body+=c;if(body.length>4096)req.destroy()});req.on('end',()=>{
 let token;try{token=JSON.parse(body).token}catch{return send(res,400,{verified:false},requestOrigin)}
 if(typeof token!=='string'||token.length<20||token.length>2048)return send(res,400,{verified:false},requestOrigin);
 const data=new URLSearchParams({secret,response:token}).toString();
 const check=https.request('https://www.google.com/recaptcha/api/siteverify',{method:'POST',timeout:8000,headers:{'Content-Type':'application/x-www-form-urlencoded','Content-Length':Buffer.byteLength(data)}},g=>{
 let chunks='';g.on('data',c=>{chunks+=c;if(chunks.length>8192)g.destroy()});g.on('end',()=>{let v={};try{v=JSON.parse(chunks)}catch{}; const verified=v.success===true && (v.hostname==='ethos-tribo-autorizacao.onrender.com'||v.hostname==='www.ethostribo.com.br');send(res,verified?200:400,{verified},requestOrigin)})});
 check.on('timeout',()=>check.destroy());check.on('error',()=>send(res,503,{verified:false},requestOrigin));check.end(data);
 });
}).listen(PORT,'0.0.0.0',()=>console.log('reCAPTCHA verification service ready'));