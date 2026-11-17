// Native browser seam: exact published book, genuine NB login and pointer navigation.
const {chromium}=require(require.resolve('@playwright/test',{paths:[process.env.NB_NAV_HARNESS || process.cwd()]}));
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
(async()=>{
 const state=process.env.NB_BASELINE_STATE, out=process.env.NB_NAV_RESULTS;
 assert(state&&out);fs.mkdirSync(out,{recursive:true});
 const settings=JSON.parse(fs.readFileSync(path.join(state,'settings.json'))), fixture=JSON.parse(fs.readFileSync(path.join(state,'fixture.json')));
 const browser=await chromium.launch();const context=await browser.newContext({ignoreHTTPSErrors:true,extraHTTPHeaders:{Accept:'application/json'}});
 await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 const page=await context.newPage();page.setDefaultTimeout(12000);const errors=[];
 const socketRequests=[];page.on('request',r=>{if(r.url().includes('/socket.io'))socketRequests.push(r.url());});
 page.on('pageerror',e=>errors.push(e.stack||e.message));
 page.on('console',async msg=>{if(msg.type()==='error')for(const arg of msg.args()){try{const e=await arg.evaluate(x=>x instanceof Error?x.stack:String(x));errors.push(e);}catch{}}});
 const origin='https://127.0.0.1:3001', index='/books/social_psychology/13:_Competition_and_Cooperation_in_Our_Social_Worlds/';
 const login=await context.request.post('https://127.0.0.1:3000/api/users/login',{data:{username:settings.users[0].username,password:settings.users[0].password}});const {token}=await login.json();
 const folder=await (await context.request.get('https://127.0.0.1:3000/api/files/class/'+fixture.courseId,{headers:{Authorization:'Bearer '+token}})).json();
 const existing=await (await context.request.get('https://127.0.0.1:3000/api/files/folder/'+folder.id,{headers:{Authorization:'Bearer '+token}})).json();
 for(const tail of ['', '13.01:_Conflict_Cooperation_Morality_and_Fairness/','13.02:_How_the_Social_Situation_Creates_Conflict-_The_Role_of_Social_Dilemmas/']){
 if(existing.some(f=>f.Source?.filepath===origin+index+tail))continue;
 const r=await context.request.post('https://127.0.0.1:3000/api/files/file/'+folder.id,{headers:{Authorization:'Bearer '+token},data:{name:'navigation',url:origin+index+tail}});assert.equal(r.status(),200);
 }
 await page.goto(origin+index+'13.01:_Conflict_Cooperation_Morality_and_Fairness/');
 await page.getByLabel('Username:').fill(settings.users[0].username);await page.getByLabel('Password:').fill(settings.users[0].password);await page.locator('form.login-form button').click();
 await page.getByRole('button',{name:'Switch account',exact:true}).waitFor();
 await page.locator('summary').filter({hasText:'Choose a passage with the keyboard'}).click();
 assert(!await page.locator('.nb-book-controls [role=status]').innerText().then(t=>t.includes('Sign in')));
 await page.getByRole('button',{name:'Switch account',exact:true}).click();
 await page.getByLabel('Username:').fill(settings.users[1].username);await page.getByLabel('Password:').fill(settings.users[1].password);await page.locator('form.login-form button').click();
 await page.getByRole('button',{name:'Switch account',exact:true}).waitFor();
 try{
 for(const width of [1280,1440,390]){
 await page.setViewportSize({width,height:720});await page.goto(origin+index);await page.locator('#nb-sidebar').waitFor();
 const link=page.locator('#main-content a[href*="/13.02:"]').first();
 await link.scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,width+'.png')});
 const box=await link.boundingBox();fs.writeFileSync(path.join(out,width+'.json'),JSON.stringify({box,errors},null,2));
 await link.click({timeout:4000});await page.goBack();
 await page.locator('#main-content a[href*="/13.01:"]').first().click();await page.goBack();
 await page.locator('.collapse-button').click();
 await link.click({timeout:4000});assert(page.url().includes('/13.02:'));await page.goBack();
 await page.locator('#main-content a[href*="/13.01:"]').first().click();assert(page.url().includes('/13.01:'));await page.goBack();
 await page.locator('#main-content a[href*="/13.01:"]').first().click();
 const search=page.locator('#nb-sidebar .search .ql-editor');await search.fill('cooperation');await search.fill('');
 await page.locator('summary').filter({hasText:'Choose a passage with the keyboard'}).click();
 await page.getByLabel('Choose a passage to discuss').selectOption({index:1});await page.getByRole('button',{name:'Discuss selected passage',exact:true}).click();
 await page.locator('.editor-view .ql-editor').fill('navigation draft only');await page.locator('.editor-view button.cancel').click();
 await page.evaluate(()=>{for(const k of Object.keys(localStorage))if(k!=='nb.user')localStorage.removeItem(k);});
 await page.locator('#tts-enter').click();
 await page.locator('.tts-dialog [data-act=accept], .tts-bar').first().waitFor();
 if(await page.locator('.tts-dialog [data-act=accept]').isVisible())await page.locator('.tts-dialog [data-act=accept]').click();
 await page.locator('.tts-bar').waitFor();assert.equal(await page.locator('#nb-sidebar').isVisible(),false);
 await page.locator('[data-act=exit]').click();await page.locator('#nb-sidebar').waitFor();
 await page.goBack();
 await page.goto(origin+index);await page.locator('#nb-sidebar').waitFor();
 await page.locator('#main-content a[href*="/13.02:"]').first().click();await page.goBack();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.equal(await page.evaluate(()=>{const m=document.querySelector('#main-content').getBoundingClientRect();return [...document.querySelectorAll('#main-content a')].some(a=>a.getBoundingClientRect().right>m.right+1);}),false);
 }
 assert.equal(errors.filter(e=>/querySelectorAll|reading 'username'|reading 'toUpperCase'/.test(e)).length,0,JSON.stringify(errors));assert.equal(socketRequests.length,0,'disabled socket must not connect');
 }finally{fs.writeFileSync(path.join(out,'errors.json'),JSON.stringify(errors,null,2));await browser.close();}
})();
