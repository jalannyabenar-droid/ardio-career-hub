(() => {
  const KW = [['influencer',3],['kol',3],['social media',3],['digital marketing',3],['content',2],['brand',2],['campaign',2],['community',2],['tiktok',2],['instagram',2],['engagement',2],['creative',1],['video',1],['launch',1],['strategy',1],['event',1]];
  const TITLE = /marketing|social media|influencer|creator|brand|campaign|content|community|growth/i;
  const OPEN = /worldwide|anywhere|global|asia|apac|indonesia|southeast|\bsea\b/i;
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  const text = h => new DOMParser().parseFromString(h || '', 'text/html').body.textContent.replace(/\s+/g, ' ').trim();
  const roles = ['Digital Marketing Specialist','Social Media Specialist','Influencer Marketing Coordinator','Brand Marketing Specialist','Marketing Campaign Specialist','Content Strategist','Digital Marketing Consultant'];
  const q = encodeURIComponent;
  $('#jlinks').innerHTML = [
    ['LinkedIn (remote, Indonesia)', r => `https://www.linkedin.com/jobs/search/?keywords=${q(r)}&location=Indonesia&f_WT=2`],
    ['Indeed Indonesia', r => `https://id.indeed.com/jobs?q=${q(r + ' remote')}`],
    ['We Work Remotely', r => `https://weworkremotely.com/remote-jobs/search?term=${q(r)}`],
    ['Remote OK', () => 'https://remoteok.com/remote-marketing-jobs']
  ].map(([n, f]) => `<a href="${f(roles[0])}" target="_blank" rel="noopener" data-n="${n}">${n}: ${roles[0]}</a>`).join('') +
    roles.slice(1).map(r => `<a href="https://www.linkedin.com/jobs/search/?keywords=${q(r)}&location=Indonesia&f_WT=2" target="_blank" rel="noopener">LinkedIn: ${r}</a>`).join('');

  $('#jlinks').insertAdjacentHTML('afterend','<h3 style="margin:1.6rem 0 .6rem;font-size:1.1rem">Find small-business and freelance clients</h3><div class="links">'+[['Upwork: social media',`https://www.upwork.com/nx/search/jobs/?q=${q('social media marketing')}`],['Upwork: influencer marketing',`https://www.upwork.com/nx/search/jobs/?q=${q('influencer marketing')}`],['LinkedIn: freelance social media, Indonesia',`https://www.linkedin.com/jobs/search/?keywords=${q('freelance social media')}&location=Indonesia`],['Fastwork.id','https://fastwork.id'],['Sribulancer','https://www.sribulancer.com'],['Projects.co.id','https://projects.co.id']].map(([n,u])=>`<a href="${u}" target="_blank" rel="noopener">${n}</a>`).join('')+'</div>');
  let jobs = [], checked = null;
  async function fetchJobs() {
    try { const c = JSON.parse(localStorage.getItem('rj-cache') || 'null');
      if (c && Date.now() - c.t < 6 * 3600e3) { checked = new Date(c.t); return c.jobs; } } catch (e) {}
    const r = await fetch('https://remotive.com/api/remote-jobs?category=marketing&limit=200');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const j = (await r.json()).jobs || [];
    checked = new Date();
    try { localStorage.setItem('rj-cache', JSON.stringify({ t: Date.now(), jobs: j })); } catch (e) {}
    return j;
  }
  function score(j) {
    const t = (j.title || '').toLowerCase(), b = (text(j.description) + ' ' + (j.tags || []).join(' ')).toLowerCase();
    let s = 0; const hit = [];
    KW.forEach(([k, w]) => { const inT = t.includes(k), inB = b.includes(k); if (inT || inB) { s += inT ? w * 3 : w; hit.push(k); } });
    return { s, hit };
  }
  function draw() {
    const role = $('#jr').value, type = $('#jt').value, sal = $('#js').value, days = +$('#jd').value || 21, all = $('#jx').checked;
    const rx = role ? new RegExp(role, 'i') : TITLE;
    const list = jobs.filter(j => rx.test(j.title) && (!type || j.job_type === type) && (!sal || j.salary) &&
      ((Date.now() - new Date(j.publication_date)) / 864e5 <= days) &&
      (all || !j.candidate_required_location || OPEN.test(j.candidate_required_location)))
      .map(j => ({ j, ...score(j) })).sort((a, b) => new Date(b.j.publication_date) - new Date(a.j.publication_date) || b.s - a.s).slice(0, 30);
    $('#jstat').textContent = `${list.length} listings from the last ${days} days, newest first. Last checked ${checked ? checked.toLocaleString() : 'never'}.`;
    $('#jl').innerHTML = list.map(({ j, hit }) => `<article class="card jc"><h3>${esc(j.title)}</h3>
      <p class="meta">${esc(j.company_name)} | ${esc(j.candidate_required_location || 'Location not stated')} | ${esc((j.job_type || 'type not stated').replace('_', '-'))}<br>
      ${j.salary ? 'Salary: ' + esc(j.salary) : 'Salary not listed'} | Posted ${esc(new Date(j.publication_date).toLocaleDateString())}</p>
      ${hit.length ? `<div class="why"><strong>Why it fits:</strong> keyword match with my experience: ${hit.slice(0, 5).map(esc).join(', ')}</div>` : ''}
      <details><summary>Description</summary><p>${esc(text(j.description).slice(0, 700))}...</p></details>
      <a class="btn sm p" href="${esc(j.url)}" target="_blank" rel="noopener">View listing and apply</a> <a class="btn sm" href="tracker.html?type=job&company=${q(j.company_name)}&role=${q(j.title)}&url=${q(j.url)}">Save to tracker</a></article>`).join('') ||
      '<div class="empty">No listings match these filters. Try another role or include region-limited roles.</div>';
  }
  ['#jr', '#jt', '#js', '#jd', '#jx'].forEach(s => $(s).onchange = draw);
  fetchJobs().then(j => { jobs = j; draw(); }).catch(() => {
    $('#jstat').textContent = 'Live listings could not load right now. Use the platform links below.';
  });
})();
