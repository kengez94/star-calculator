const config = [
  { key: 'role', label: '角色等级', bonus: 100 },
  { key: 'equip', label: '装备强化等级', bonus: 38 },
  { key: 'skill', label: '技能等级', bonus: 13 },
  { key: 'beast', label: '幻兽等级', bonus: 14 },
  { key: 'relic', label: '古遗物等级', bonus: 57 },
];
const state = { role:'', equip:'', skill:'', beast:'', relic:'' };
const warnings = {};

function calcLimits(roleLevel){
  const r = parseInt(roleLevel) || 0;
  return {
    beast: 40 + Math.floor(r / 10) * 40,
    relic: 20 + Math.floor(r / 10) * 20,
    skill: r * 8
  };
}
function clampAndWarn(key, val, limits){
  let v = parseInt(val) || 0;
  let warn = '';
  if(key==='beast' && v>limits.beast){v=limits.beast;warn=`幻兽等级已达上限 (${limits.beast})！`;}
  if(key==='relic' && v>limits.relic){v=limits.relic;warn=`古遗物等级已达上限 (${limits.relic})！`;}
  if(key==='skill' && v>limits.skill){v=limits.skill;warn=`技能等级已达上限 (${limits.skill})！`;}
  warnings[key]=warn;return v;
}
function renderInputs(){
  const container=document.getElementById('inputs');
  container.innerHTML='';
  const limits=calcLimits(state.role);
  config.forEach(item=>{
    const div=document.createElement('div');div.className='input-card';
    const row=document.createElement('div');row.className='input-row';
    const label=document.createElement('label');label.innerText=item.label;
    const input=document.createElement('input');input.type='number';input.min='0';input.placeholder='请输入';input.value=state[item.key]||'';
    input.addEventListener('input',e=>{const raw=e.target.value;if(raw===''){state[item.key]='';warnings[item.key]='';render();return;}const clamped=clampAndWarn(item.key,raw,limits);state[item.key]=clamped;render();});
    row.append(label,input);
    const small=document.createElement('div');small.className='small';small.innerText=`每提升1级 +${item.bonus} 分`;
    div.append(row,small);
    if(['skill','beast','relic'].includes(item.key)){const lim=item.key==='skill'?limits.skill:(item.key==='beast'?limits.beast:limits.relic);const limitDiv=document.createElement('div');limitDiv.className='small';limitDiv.style.color='#ff8da1';limitDiv.innerText=`等级上限：${lim}`;div.append(limitDiv);}
    const warn=document.createElement('div');warn.className='small';warn.style.color='#ff9aa2';warn.style.textAlign='right';warn.style.marginTop='6px';warn.innerText=warnings[item.key]||'';div.append(warn);
    container.append(div);
  });
}
function compute(){
  const total=config.reduce((sum,i)=>sum+(parseInt(state[i.key])||0)*i.bonus,0);
  const star=Math.floor(total/100+10);
  return{total,star};
}
function render(){
  renderInputs();
  const out=compute();
  document.getElementById('total').innerText=out.total;
  document.getElementById('star').innerText=out.star;
}
document.getElementById('resetBtn').addEventListener('click',()=>{config.forEach(i=>state[i.key]='');for(let k in warnings)warnings[k]='';render();});
render();
