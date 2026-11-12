import json,subprocess,os,re,sys
SC=os.getcwd();ENV=dict(os.environ,NODE_PATH=SC+'/node_modules')
def node(args):
    r=subprocess.run(['node','build74.js']+args,env=ENV,capture_output=True,text=True,cwd=SC);return r.stdout+r.stderr
def measure(tasks,tmp='ss/_m.json'):
    json.dump(tasks,open(tmp,'w'),ensure_ascii=False)
    out=node(['0',tmp,'/dev/null','measure']);m=re.search(r'RESULT (.*)',out);return json.loads(m.group(1))
import hashlib
def tkey(t,base):
    k=re.sub(r'\W+','',(t['title']+''.join(t['paras'])).lower())
    if t['img']:k+=hashlib.md5(open(base+t['img'][0]['file'],'rb').read()).hexdigest()
    return k
USED_KEYS=set()
for s_ in json.load(open('s5/sheets.json')):
    for t_ in s_['tasks']:USED_KEYS.add(tkey(t_,'s5/'))
def pick(n):
    U=[t for t in json.load(open(f'ss/unique{n}.json')) if tkey(t,'ss/') not in USED_KEYS]
    json.dump(U,open(f'ss/pool{n}.json','w'),ensure_ascii=False,indent=1)
    hs=measure(U)
    for t,h in zip(U,hs):t['h']=h
    plan={1:2,2:3,3:3,4:2}
    used=set();titles=set();sheets=[];sn=0
    for lv in (1,2,3,4):
        pool=[t for t in U if t['level']==lv]
        need=plan[lv]*4
        # Auswahl: Aufgaben mit h<=2.5 bevorzugt, Titel unterschiedlich, über Seiten gestreut
        cand=[t for t in pool if t['h']<=2.55]
        step=max(1,len(cand)//need)
        chosen=[];seen_t=set()
        for pass_ in (0,1):
            for i in range(0,len(cand)):
                t=cand[(i*step)%len(cand)] if pass_==0 else cand[i]
                key=(t['page'],t['idx'])
                if key in used or len(chosen)>=need:continue
                tt=re.sub(r'\W+','',t['title'])
                if pass_==0 and tt in titles:continue
                used.add(key);titles.add(tt);chosen.append(t)
            if len(chosen)>=need:break
        if len(chosen)<need:
            for t in sorted(pool,key=lambda x:x['h']):
                key=(t['page'],t['idx'])
                if key not in used and len(chosen)<need:used.add(key);chosen.append(t)
        # Balancieren: Schlangenverteilung nach Höhe
        chosen.sort(key=lambda t:-t['h']);k=plan[lv];groups=[[] for _ in range(k)]
        for i,t in enumerate(chosen):
            r=i//k;c=i%k;groups[c if r%2==0 else k-1-c].append(t)
        for g in groups:
            sn+=1;g.sort(key=lambda t:(t['page'],t['idx']));sheets.append(dict(n=sn,level=lv,tasks=g))
    return sheets
def fix(n,sheets):
    U=json.load(open(f'ss/pool{n}.json'));
    for it in range(8):
        json.dump(sheets,open(f'ss/sheets{n}.json','w'),ensure_ascii=False)
        out=node([str(n),f'ss/sheets{n}.json',f'/tmp/_t{n}.pptx'])
        res=[json.loads(x) for x in re.findall(r'SHEET (.*)',out)]
        bad=[r for r in res if r['rest']<0 or r['fs']<9.25]
        print('S',n,'Iteration',it,'Blätter mit Problem:',[(r['n'],r['fs'],r['rest']) for r in bad])
        if not bad:break
        used={(t['page'],t['idx']) for s in sheets for t in s['tasks']}
        for r in bad:
            sh=sheets[r['n']-1];i=max(range(4),key=lambda j:r['h'][j])
            pool=[t for t in U if t['level']==sh['level'] and (t['page'],t['idx']) not in used]
            hs=measure(pool);cand=sorted(zip(hs,range(len(pool))))
            if not cand:continue
            h,j=cand[0];new=pool[j];used.add((new['page'],new['idx']));old=sh['tasks'][i];sh['tasks'][i]=new
            print('   Blatt',r['n'],'tausche',old['title'],'->',new['title'])
    return sheets,res
if __name__=='__main__':
    for n in sys.argv[1:]:
        sh=pick(n);sh,res=fix(n,sh)
        for s_ in sh:
            for t_ in s_['tasks']:USED_KEYS.add(tkey(t_,'ss/'))
        keys=[(t['page'],t['idx']) for s in sh for t in s['tasks']];print('S',n,len(keys),'Aufgaben,',len(set(keys)),'verschieden')
