// The ten agents as line icons: one shared robot base, one prop each.
// RobotKit.svg(id, 'line' | 'solid', { ink, shell }) → SVG string.
// Add the class `working` to any ancestor to switch a robot to its working loop;
// the idle and working animations are in index.html under "robots".
// ROBOTKIT-START
const RobotKit = (() => {
  const ROBOTS = [
    { id:'alpha',   name:'Alpha',   role:'System architect',   accent:'#2774AE', hat:'hardhat', prop:'roll',      work:'tap' },
    { id:'lylia',   name:'Lylia',   role:'Brand designer',     accent:'#6E4FC9', hat:'beret',   prop:'brush',     work:'sweep' },
    { id:'sora',    name:'Sora',    role:'SEO strategist',     accent:'#0E6E5C', hat:'pin',     prop:'lens',      work:'scan' },
    { id:'nana',    name:'Nana',    role:'Copywriter',         accent:'#C2410C', hat:'bubble',  prop:'pencil',    work:'write' },
    { id:'kagura',  name:'Kagura',  role:'UI designer',        accent:'#1B5687',                prop:'tablet',    work:'layout' },
    { id:'kimmy',   name:'Kimmy',   role:'Technical SEO',      accent:'#1D6FA0', face:'glasses',prop:'wrench',    work:'turn' },
    { id:'cyclops', name:'Cyclops', role:'Database engineer',  accent:'#0054A6', face:'cyclops',prop:'db',        work:'db' },
    { id:'hanabi',  name:'Hanabi',  role:'Blog writer',        accent:'#8A5A00',                prop:'book',      work:'flip' },
    { id:'layla',   name:'Layla',   role:'QA & deploy',        accent:'#4F5257',                prop:'clipboard', work:'check' },
    { id:'gloo',    name:'Gloo',    role:'Google & ads setup', accent:'#157A45', hat:'headset', prop:'chart',     work:'bars' },
  ];

  // style: 'line' | 'solid'. opt.ink / opt.shell may be CSS colours or var(--x).
  function svg(id, style = 'solid', opt = {}) {
    const r = ROBOTS.find(x => x.id === id);
    const L = style === 'line';
    const C = { A: r.accent, G: opt.ink || '#17181C', S: opt.shell || '#FFFFFF', P: '#FFFFFF', H: '#B5B7BC', K: '#17181C' };
    const k = v => C[v] || v;
    const W = 2;
    const cl = c => c ? `class="${c}" ` : '';
    // filled shape: outlined in line, flat in solid
    const f = (tag, a, lf, sf, c) =>
      `<${tag} ${cl(c)}${a} style="fill:${k(L ? lf : sf)}${L ? `;stroke:${C.G};stroke-width:${W};stroke-linejoin:round` : ''}"/>`;
    // flat shape in both styles
    const p = (tag, a, lf, sf = lf, c, extra = '') =>
      `<${tag} ${cl(c)}${a} style="fill:${k(L ? lf : sf)}${extra}"/>`;
    // stroked path
    const s = (d, lc, sc, lw, sw, c) =>
      `<path ${cl(c)}d="${d}" style="fill:none;stroke:${k(L ? lc : sc)};stroke-width:${L ? lw : sw};stroke-linecap:round;stroke-linejoin:round"/>`;
    const shade = d => L ? '' : `<path d="${d}" style="fill:#000;fill-opacity:.16"/>`;
    const lite = d => L ? '' : `<path d="${d}" style="fill:#fff;fill-opacity:.24"/>`;

    // ----- head -----
    let head = '';
    if (r.hat === 'headset') head += s('M11 24C11 8.5 53 8.5 53 24', 'G', 'G', W, 2.6);
    if (!r.hat) head += s('M32 16V11', 'G', 'G', W, 2.6) + f('circle', 'cx="32" cy="8.6" r="2.6"', 'A', 'A');
    if (r.hat === 'headset') {
      head += f('rect', 'x="8" y="22" width="6" height="14" rx="3"', 'A', 'A') + f('rect', 'x="50" y="22" width="6" height="14" rx="3"', 'A', 'A');
    } else {
      head += f('rect', 'x="9.5" y="23.5" width="4.5" height="11" rx="2.25"', 'S', 'G') + f('rect', 'x="50" y="23.5" width="4.5" height="11" rx="2.25"', 'S', 'G');
    }
    head += f('rect', 'x="13" y="16" width="38" height="26" rx="10"', 'S', 'A');
    head += shade('M13 31H51V32A10 10 0 0 1 41 42H23A10 10 0 0 1 13 32Z');
    head += f('rect', 'x="18" y="21" width="28" height="15.5" rx="6"', 'A', 'G');
    if (!L) head += '<path d="M38 21.6H41.6L36.4 36H32.8Z" style="fill:#fff;fill-opacity:.07"/>';

    // face
    if (r.face === 'cyclops') {
      head += `<g class="r-eyes">${p('circle', 'cx="32" cy="27.8" r="5.4"', 'P')}<g class="r-pupil">${p('circle', 'cx="32" cy="27.8" r="2.5"', 'K', 'A')}${p('circle', 'cx="33" cy="26.8" r=".8"', 'P')}</g></g>`;
      head += s('M30 34.4Q32 35.6 34 34.4', 'P', 'P', 1.4, 1.4);
    } else {
      head += `<g class="r-eyes">${p('rect', 'x="24.2" y="24.8" width="3.6" height="6.4" rx="1.8"', 'P')}${p('rect', 'x="36.2" y="24.8" width="3.6" height="6.4" rx="1.8"', 'P')}</g>`;
      head += s('M29.4 33Q32 34.8 34.6 33', 'P', 'P', 1.6, 1.6);
      if (r.face === 'glasses') head += s('M21 28A5 5 0 1 0 31 28A5 5 0 1 0 21 28ZM33 28A5 5 0 1 0 43 28A5 5 0 1 0 33 28ZM31 28H33', 'P', 'P', 1.5, 1.5);
    }

    // headwear
    if (r.hat === 'hardhat') {
      head += f('path', 'd="M15 17.5A17 13 0 0 1 49 17.5Z"', 'A', 'A') + shade('M32 4.5A17 13 0 0 1 49 17.5H32Z');
      head += L ? s('M32 6V16', 'G', 'G', W, W) : lite('M29.6 4.8H34.4V17.5H29.6Z');
      head += f('rect', 'x="10" y="15.5" width="44" height="4.5" rx="2.25"', 'A', 'G');
    }
    if (r.hat === 'beret') {
      head += f('path', 'd="M11.5 16.5C11 9.5 21 5.5 32.5 5.5C44 5.5 52.5 9 52 13.5C51.6 17 45 18.5 32 18.5C20 18.5 11.6 18.5 11.5 16.5Z"', 'A', 'A');
      head += shade('M11.6 15.2C17 17.2 26 17.6 33 17.4C43 17.2 50 16.2 51.9 13.5C51.6 17 45 18.5 32 18.5C20 18.5 11.6 18.5 11.5 16.5Z');
      head += s('M33.5 5.5Q33.8 3 36 2.4', 'G', 'A', W, 2.6);
    }
    if (r.hat === 'pin') {
      head += f('path', 'd="M32 2C28.7 2 26 4.6 26 7.8C26 11.8 32 16.5 32 16.5S38 11.8 38 7.8C38 4.6 35.3 2 32 2Z"', 'A', 'A');
      head += shade('M32 2C35.3 2 38 4.6 38 7.8C38 11.8 32 16.5 32 16.5Z') + p('circle', 'cx="32" cy="7.8" r="2"', 'P');
    }
    if (r.hat === 'bubble') {
      head += f('path', 'd="M25 2.5H39A3 3 0 0 1 42 5.5V10.5A3 3 0 0 1 39 13.5H35L32 16.5L29 13.5H25A3 3 0 0 1 22 10.5V5.5A3 3 0 0 1 25 2.5Z"', 'A', 'A');
      head += p('circle', 'cx="27.8" cy="8" r="1.3"', 'P', 'P', 'r-dot') + p('circle', 'cx="32" cy="8" r="1.3"', 'P', 'P', 'r-dot r-dot2') + p('circle', 'cx="36.2" cy="8" r="1.3"', 'P', 'P', 'r-dot r-dot3');
    }
    if (r.hat === 'headset') {
      head += s('M11 34C11 39.5 14.5 41.6 19.5 41.6', 'G', 'G', 1.8, 2.2) + f('circle', 'cx="20.5" cy="41.6" r="1.9"', 'A', 'A');
    }

    // ----- body -----
    let body = '';
    body += f('rect', 'x="27.5" y="40" width="9" height="5" rx="2"', 'S', 'G');
    body += f('rect', 'x="21" y="44" width="22" height="14" rx="5"', 'S', 'A');
    body += shade('M32 44H38A5 5 0 0 1 43 49V53A5 5 0 0 1 38 58H32Z');
    body += L ? f('circle', 'cx="32" cy="51" r="2.6"', 'A', 'A', 'r-core') : p('circle', 'cx="32" cy="51" r="2.8"', 'P', 'P', 'r-core');
    body += s('M21.5 48.5L16.8 52.8', 'G', 'G', W, 3.4) + f('circle', 'cx="15.6" cy="54" r="2.8"', 'S', 'G');
    body += s('M42.5 48.5L47.4 51.6', 'G', 'G', W, 3.4);

    // ----- prop (held in right hand at 49,52.5) -----
    let prop = '';
    switch (r.prop) {
      case 'roll':
        prop += '<g transform="rotate(22 49 52.5)">' + f('rect', 'x="45.5" y="32" width="7" height="22" rx="3.5"', 'A', 'A')
          + shade('M49 32A3.5 3.5 0 0 1 52.5 35.5V50.5A3.5 3.5 0 0 1 49 54Z')
          + (L ? s('M47.8 40H50.2M47.8 44H50.2', 'P', 'P', 1.2, 1.2) : s('M47.4 40H50.6M47.4 44H50.6', 'P', 'P', 1, 1))
          + f('ellipse', 'cx="49" cy="34.2" rx="3.5" ry="1.8"', 'S', 'G') + '</g>';
        break;
      case 'brush':
        prop += '<g transform="rotate(24 49 52.5)">'
          + (L ? s('M49 34V54', 'G', 'G', W, W) : p('rect', 'x="47.7" y="33" width="2.6" height="21" rx="1.3"', 'G'))
          + f('rect', 'x="47" y="29.5" width="4" height="4.5" rx="1"', 'S', 'H')
          + f('path', 'd="M47 29.6C47 26 49 22 49 22C49 22 51 26 51 29.6Z"', 'A', 'A') + '</g>';
        break;
      case 'lens':
        prop += s('M51.9 46.9L49.6 51.2', 'G', 'G', 2.6, 3.6);
        prop += L ? f('circle', 'cx="54.5" cy="42" r="5.5"', 'S', 'S') + p('circle', 'cx="54.5" cy="42" r="3.4"', 'A')
                  : p('circle', 'cx="54.5" cy="42" r="6"', 'G') + p('circle', 'cx="54.5" cy="42" r="4.2"', 'A');
        prop += s('M51.6 41A3.2 3.2 0 0 1 53.6 38.8', 'P', 'P', 1.4, 1.4);
        break;
      case 'pencil':
        prop += '<g transform="rotate(26 49 52.5)">' + f('rect', 'x="46.5" y="31" width="5" height="20" rx="1"', 'A', 'A')
          + shade('M49 31H51.5V51H49Z')
          + f('path', 'd="M46.5 31L49 25L51.5 31Z"', 'S', 'H') + p('path', 'd="M48.1 27.2L49 25L49.9 27.2Z"', 'G')
          + f('rect', 'x="46.5" y="50" width="5" height="4" rx="1"', 'S', 'G') + '</g>';
        break;
      case 'tablet':
        prop += f('rect', 'x="44.5" y="36" width="15.5" height="20" rx="2.5"', 'S', 'G')
          + p('rect', 'x="47" y="38.8" width="10.5" height="2.6" rx="1"', 'A')
          + p('rect', 'x="47" y="43" width="4.8" height="5" rx="1"', 'A', 'A', 'k1')
          + p('rect', 'x="52.7" y="43" width="4.8" height="5" rx="1"', 'H', 'P', 'k2')
          + p('rect', 'x="47" y="49.5" width="10.5" height="3.5" rx="1"', 'H', 'A');
        break;
      case 'wrench':
        prop += '<g transform="rotate(32 49 52.5)">' + f('rect', 'x="47" y="40" width="4" height="14" rx="2"', 'A', 'A')
          + f('path', 'd="M47.5 33.15A4.6 4.6 0 1 0 50.5 33.15V36.2H47.5Z"', 'A', 'A')
          + shade('M49 40H51V52A2 2 0 0 1 49 54Z') + '</g>';
        break;
      case 'db':
        prop += f('path', 'd="M47.5 40V53A6 2.4 0 0 0 59.5 53V40Z"', 'A', 'A')
          + shade('M53.5 40H59.5V53A6 2.4 0 0 1 53.5 55.4Z')
          + s('M47.5 44.6A6 2.4 0 0 0 59.5 44.6M47.5 49.2A6 2.4 0 0 0 59.5 49.2', 'G', 'G', 1.5, 1.2)
          + f('ellipse', 'cx="53.5" cy="40" rx="6" ry="2.4"', 'S', 'G')
          + p('circle', 'cx="57" cy="43.2" r=".9"', 'P', 'P', 'db') + p('circle', 'cx="57" cy="47.6" r=".9"', 'P', 'P', 'db db2') + p('circle', 'cx="57" cy="52" r=".9"', 'P', 'P', 'db db3');
        break;
      case 'book':
        prop += p('path', 'd="M58 31.5L59 34.5L62 35.5L59 36.5L58 39.5L57 36.5L54 35.5L57 34.5Z"', 'A', 'A', 'r-spark');
        prop += f('path', 'd="M53.5 44.5C51 42.8 47.8 42.6 45.5 43.3V54C47.8 53.3 51 53.5 53.5 55.2Z"', 'A', 'A')
          + shade('M53.5 44.5C52.4 43.8 51.2 43.3 50 43V53.6C51.2 53.9 52.4 54.4 53.5 55.2Z')
          + s('M47.6 46.4Q49.8 45.9 51.6 46.8M47.6 49.4Q49.8 48.9 51.6 49.8', 'P', 'P', 1.1, 1.1);
        prop += '<g class="r-page">' + f('path', 'd="M53.5 44.5C56 42.8 59.2 42.6 61.5 43.3V54C59.2 53.3 56 53.5 53.5 55.2Z"', 'A', 'A')
          + s('M55.4 46.8Q57.2 45.9 59.4 46.4M55.4 49.8Q57.2 48.9 59.4 49.4', 'P', 'P', 1.1, 1.1) + '</g>';
        break;
      case 'clipboard':
        prop += f('rect', 'x="44.5" y="36.5" width="15.5" height="19.5" rx="2.2"', 'A', 'G')
          + p('rect', 'x="46.8" y="39.6" width="10.9" height="14" rx="1"', 'P')
          + f('rect', 'x="49" y="35" width="6.5" height="3.6" rx="1.3"', 'S', 'A');
        [42.8, 46.6, 50.4].forEach((y, i) => {
          prop += s(`M50.2 ${y}L51.3 ${y + 1.1}L53.3 ${y - 1.2}`, 'A', 'A', 1.4, 1.5, `ck ck${i + 1}`) + s(`M54.9 ${y}H56.4`, 'H', 'H', 1.2, 1.2);
        });
        break;
      case 'chart':
        prop += f('rect', 'x="45" y="38.5" width="17" height="14.5" rx="2.5"', 'A', 'A')
          + shade('M45 46H62V50.5A2.5 2.5 0 0 1 59.5 53H47.5A2.5 2.5 0 0 1 45 50.5Z')
          + p('rect', 'x="50" y="46" width="2.8" height="4.5" rx=".8"', 'P', 'P', 'bar1')
          + p('rect', 'x="54" y="43.5" width="2.8" height="7" rx=".8"', 'P', 'P', 'bar2')
          + p('rect', 'x="58" y="41" width="2.8" height="9.5" rx=".8"', 'P', 'P', 'bar3');
        break;
    }
    prop += f('circle', 'cx="49" cy="52.5" r="2.8"', 'S', 'G');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="rb-svg w-${r.work}" role="img" aria-label="${r.name}, ${r.role}">`
      + body + `<g class="r-prop">${prop}</g>` + `<g class="r-head">${head}</g></svg>`;
  }
  return { ROBOTS, svg };
})();
// ROBOTKIT-END
window.RobotKit = RobotKit;
