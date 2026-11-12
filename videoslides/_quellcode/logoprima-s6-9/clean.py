import json,re
def fixq(t):
    a=t['ans']
    if '?' not in a:return a
    pat=''.join(r'.\s*' if ch=='?' else re.escape(ch) for ch in re.sub(r'\s+',' ',a.strip())).replace('\\ ',r'\s*')
    for p in t['paras']:
        if re.fullmatch(pat,re.sub(r'\s+',' ',p.strip())):return p
    return a
def clean(t):
    t['paras']=[re.sub(r'(?<=[\w\)])\s*•\s*(?=[\w\(\d])',' · ',p) for p in t['paras']]
    t['ans']=fixq(t)
    t['ans']=re.sub(r'(?<=[\w\)])\s*•\s*(?=[\w\(\d])',' · ',t['ans'])
    if t['title']=='Einkaufen':t['ans']=t['ans'].replace('12 ? 70 c','12 € 70 c')
    return t
for n in (6,7,8,9):
    U=json.load(open(f'ss/unique{n}.json'))
    U=[clean(t) for t in U if not (n==8 and t['title']=='Rauminhalt')]
    json.dump(U,open(f'ss/unique{n}.json','w'),ensure_ascii=False,indent=1)
    rest=[(t['title'],t['ans']) for t in U if '?' in t['ans'] and not t['ans'].strip().endswith('?')]
    print(n,len(U),'offene ?-Antworten:',rest)
