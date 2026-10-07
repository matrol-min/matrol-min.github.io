/* Academic CV — shared labels, sample data, and view-model builder.
   In production: cv-data/*.yml → JSON at build time; metric/group counts are aggregated from the lists.
   Field names and values mirror the YAML: papers {title, authors, venue, year, doi, role, scope},
   patents {title, inventors, number, year, status, scope}.
   Everything below except name / title / affiliation is SAMPLE content. */
(function () {
  const LABELS = {
    en: {
      profile: 'Profile', summary: 'Research Summary', experience: 'Experience', education: 'Education',
      interests: 'Research Interests', projects: 'Research Projects', skills: 'Skills', awards: 'Awards',
      publications: 'Publications', patents: 'Patents',
      intlPapers: 'International Papers', domPapers: 'Domestic Papers',
      intlPatents: 'International Patents', domPatents: 'Domestic Patents',
      mPapers: 'Papers', mFirst: 'First-author', mFiled: 'Patents filed', mRegistered: 'Registered patents',
      role: { first: '1st author', corresponding: 'Corresponding', co: '' },
      status: { registered: 'Registered', pending: 'Pending' },
      paper: 'paper', papers: 'papers', patent: 'patent', patentsUnit: 'patents',
      back: 'Back to summary', showAll: 'Show all', showLess: 'Show less', jump: 'Go to list',
      sections: 'Sections', lists: 'Lists', email: 'Email'
    }
  };

  const SELF = 'S.-Y. Min'; // bolded wherever it appears in authors / inventors

  const DATA = {
    person: {
      name: 'Sung-Yong Min', title: 'Principal Engineer',
      org: 'Visual Display Business, Samsung Electronics',
      degree: 'Ph.D., Materials Science & Engineering, POSTECH',
      email: 'sungyong.min@example.com',
      photo: 'cv-data/SYMin-050.jpeg', // single place to swap the profile photo
      photoAlt: 'Portrait of Sung-Yong Min'
    },
    profile: 'Process engineer working on interconnection and repair technologies for micro-LED displays. Background in printed organic and nanowire electronics, with experience taking laboratory processes to mass-production lines.',
    // Placeholder totals for the sample (the lists below are excerpts). In production these are aggregated:
    // papers = papers.length, firstAuthor = role==='first', patentsFiled = patents.length, registered = status==='registered'
    counts: { papers: 31, firstAuthor: 10, patentsFiled: 153, registered: 70, intlPapers: 27, domPapers: 4, intlPatents: 108, domPatents: 45 },
    experience: [
      { period: '2019 – Present', role: 'Principal Engineer', org: 'Samsung Electronics · Visual Display Business', bullets: ['Lead micro-LED interconnection and pixel-repair process development', 'Transfer of bonding and laser-repair processes to mass production'] },
      { period: '2014 – 2019', role: 'Senior Engineer', org: 'Samsung Electronics · Visual Display Business', bullets: ['Developed fine-pitch bonding processes for large-format displays'] },
      { period: '2013 – 2014', role: 'Postdoctoral Researcher', org: 'POSTECH · Materials Science & Engineering', bullets: ['Printed organic nanowire electronics'] }
    ],
    education: [
      { period: '2008 – 2013', degree: 'Ph.D., Materials Science & Engineering', org: 'POSTECH', note: 'Dissertation on printed organic nanowire devices' },
      { period: '2004 – 2008', degree: 'B.S., Materials Science & Engineering', org: 'POSTECH', note: '' }
    ],
    interests: ['Micro-LED interconnection', 'Laser-assisted pixel repair', 'Mass transfer processes', 'Printed & flexible electronics', 'Organic nanowire devices'],
    projects: [
      { period: '2021 – 2024', title: 'Laser-based repair of defective micro-LED pixels', sponsor: 'Samsung Electronics (internal)', role: 'Project lead' },
      { period: '2017 – 2020', title: 'Low-temperature bonding for large-area modular displays', sponsor: 'Samsung Electronics (internal)', role: 'Process lead' },
      { period: '2010 – 2013', title: 'Direct printing of aligned organic nanowires', sponsor: 'National Research Foundation of Korea', role: 'Graduate researcher' }
    ],
    skills: [
      { group: 'Process', items: ['Micro-LED transfer', 'Laser bonding & repair', 'ACF bonding', 'Photolithography'] },
      { group: 'Characterization', items: ['SEM / FIB', 'XPS', 'Electrical reliability testing'] },
      { group: 'Tools', items: ['Python', 'MATLAB', 'COMSOL'] }
    ],
    awards: [
      { year: '2023', title: 'Samsung Best Engineer Award', org: 'Samsung Electronics' },
      { year: '2013', title: 'Best Doctoral Dissertation Award', org: 'POSTECH' },
      { year: '2012', title: 'Best Poster Award', org: 'International conference (sample)' }
    ],
    papers: [
      { scope: 'international', year: 2014, role: 'corresponding', doi: '', title: 'Large-scale organic nanowire lithography and electronics', authors: ['S. Lee', 'S.-Y. Min', 'T.-W. Lee'], venue: 'Nat. Commun., 5, 3279 (2014)' },
      { scope: 'international', year: 2013, role: 'first', doi: '10.1038/ncomms2785', title: 'Large-scale organic nanowire lithography and electronics', authors: ['S.-Y. Min', 'T.-S. Kim', 'B. J. Kim', 'H. Cho', 'T.-W. Lee'], venue: 'Nat. Commun., 4, 1773 (2013)' },
      { scope: 'international', year: 2013, role: 'co', doi: '', title: 'Organic nanowire fabrication and device applications', authors: ['T.-S. Kim', 'S.-Y. Min', 'W. Xu', 'T.-W. Lee'], venue: 'Small, 9, 3972-3978 (2013)' },
      { scope: 'international', year: 2012, role: 'first', doi: '', title: 'Ultrahigh-density aligned organic nanowire arrays for flexible complementary circuits', authors: ['S.-Y. Min', 'W. Xu', 'T.-W. Lee'], venue: 'Adv. Mater., 24, 5520-5525 (2012)' },
      { scope: 'international', year: 2010, role: 'first', doi: '', title: 'Printed organic semiconductor nanowires for field-effect transistors', authors: ['S.-Y. Min', 'Y. Lee', 'T.-W. Lee'], venue: 'Adv. Funct. Mater., 20, 1797-1802 (2010)' },
      { scope: 'international', year: 2010, role: 'co', doi: '', title: 'Solution-processed nanowire networks for transparent electrodes', authors: ['Y. Lee', 'S.-Y. Min', 'T.-W. Lee'], venue: 'J. Mater. Chem., 20, 9871-9876 (2010)' },
      { scope: 'domestic', year: 2013, role: 'first', doi: '', title: 'Printing conditions for organic semiconductor nanowires', authors: ['S.-Y. Min', 'T.-W. Lee'], venue: 'Polym. Sci. Technol., 24, 88-94 (2013)' },
      { scope: 'domestic', year: 2012, role: 'co', doi: '', title: 'Thermal stress in fine-pitch bonded display modules', authors: ['M. Song', 'S.-Y. Min'], venue: 'Korean J. Met. Mater., 50, 210-217 (2012)' },
      { scope: 'domestic', year: 2011, role: 'corresponding', doi: '', title: 'Alignment of organic nanowires by electrohydrodynamic printing', authors: ['J. Han', 'S.-Y. Min'], venue: 'J. Microelectron. Packag. Soc., 18, 45-52 (2011)' },
      { scope: 'domestic', year: 2010, role: 'co', doi: '', title: 'Flexible transistors based on printed nanowire arrays', authors: ['H. Cho', 'S.-Y. Min', 'T.-W. Lee'], venue: 'Polym. Sci. Technol., 21, 301-306 (2010)' }
    ],
    patents: [
      { scope: 'international', year: 2024, status: 'pending', title: 'Display module and method for repairing defective micro light-emitting diodes', inventors: ['S.-Y. Min', 'J. Park', 'H. Kim'], number: 'US 2024/0071234 A1 (2024.02.29)' },
      { scope: 'international', year: 2023, status: 'registered', title: 'Transfer substrate for micro light-emitting diodes and display apparatus using the same', inventors: ['K. Choi', 'S.-Y. Min'], number: 'US 17/512,345 (2021.10.27), Registered US 11,749,321 B2 (2023.09.05)' },
      { scope: 'international', year: 2023, status: 'registered', title: 'Display apparatus with laser-bonded interconnection', inventors: ['S.-Y. Min', 'D. Lee'], number: 'EP 21890123.4 (2021.11.02), Registered EP 4 035 512 B1 (2023.06.14)' },
      { scope: 'international', year: 2022, status: 'pending', title: 'Modular display device and tiling method thereof', inventors: ['S.-Y. Min', 'Y. Jung'], number: 'US 2022/0158004 A1 (2022.05.19)' },
      { scope: 'international', year: 2022, status: 'registered', title: 'Method of manufacturing display panel using anisotropic conductive film', inventors: ['H. Lee', 'S.-Y. Min', 'J. Yoon'], number: 'CN 201980012345.6 (2019.04.11), Registered CN 111834567 B (2022.11.22)' },
      { scope: 'domestic', year: 2023, status: 'pending', title: 'Bonding apparatus for display modules', inventors: ['K. Choi', 'S.-Y. Min'], number: '10-2023-0045021 (2023.04.05)' },
      { scope: 'domestic', year: 2014, status: 'registered', title: 'Method for fabricating organic nanowire pattern', inventors: ['T.-W. Lee', 'S.-Y. Min'], number: '10-2011-0100762 (2011.10.04), 등록 10-1374401 (2014.03.07)' },
      { scope: 'domestic', year: 2013, status: 'registered', title: 'Organic nanowire transistor and manufacturing method thereof', inventors: ['S.-Y. Min', 'T.-W. Lee'], number: '10-2011-0088915 (2011.09.02), 등록 10-1310093 (2013.09.13)' },
      { scope: 'domestic', year: 2012, status: 'pending', title: 'Electrohydrodynamic nanowire printing apparatus', inventors: ['T.-W. Lee', 'S.-Y. Min', 'T.-S. Kim'], number: '10-2012-0034517 (2012.04.03)' }
    ]
  };

  const people = list => list.map((name, i) => ({ name, self: name === SELF, other: name !== SELF, sep: i < list.length - 1 ? ', ' : '' }));

  function badge(label, solid, print) {
    if (print) return { label, bg: '#ffffff', fg: '#000000', border: solid ? '#000000' : '#8a8f96', weight: solid ? '700' : '600' };
    return solid
      ? { label, bg: '#3b6fb6', fg: '#ffffff', border: '#3b6fb6', weight: '600' }
      : { label, bg: 'transparent', fg: '#2f5f9e', border: '#9db8df', weight: '600' };
  }

  // Marks the first item of each year (newest first) so the year shows once per run.
  const byYear = items => items.slice().sort((a, b) => b.year - a.year)
    .map((it, i, arr) => ({ ...it, yearHead: i === 0 || arr[i - 1].year !== it.year, first: i === 0 }));

  function view(opts) {
    const { lang = 'en', idp = '', print = false } = opts || {};
    const L = LABELS[lang], D = DATA, C = D.counts;
    const paper = p => ({ ...p, people: people(p.authors), meta: p.venue, hasDoi: !!p.doi, doiUrl: p.doi ? 'https://doi.org/' + p.doi : '',
      badges: p.role === 'first' ? [badge(L.role.first, true, print)] : p.role === 'corresponding' ? [badge(L.role.corresponding, false, print)] : [] });
    const patent = p => ({ ...p, people: people(p.inventors), meta: p.number, doi: '', doiUrl: '', hasDoi: false,
      badges: [badge(L.status[p.status], p.status === 'registered', print)] });
    const grp = (key, label, count, items, isPaper) => ({ key, anchor: idp + key, label, count: String(count),
      unit: isPaper ? L.paper : L.patent, unitPl: isPaper ? L.papers : L.patentsUnit,
      countLabel: `${count} ${isPaper ? L.papers : L.patentsUnit}`, items: byYear(items) });
    const of = (list, scope, fn) => list.filter(x => x.scope === scope).map(fn);
    const groups = [
      grp('intl-papers', L.intlPapers, C.intlPapers, of(D.papers, 'international', paper), true),
      grp('dom-papers', L.domPapers, C.domPapers, of(D.papers, 'domestic', paper), true),
      grp('intl-patents', L.intlPatents, C.intlPatents, of(D.patents, 'international', patent), false),
      grp('dom-patents', L.domPatents, C.domPatents, of(D.patents, 'domestic', patent), false)
    ];
    const blocks = [
      { key: 'publications', id: idp + 'publications', label: L.publications, groups: groups.slice(0, 2) },
      { key: 'patents', id: idp + 'patents', label: L.patents, groups: groups.slice(2) }
    ];
    const sec = (key, extra) => ({ key, id: idp + key, label: L[key], isEntries: false, isTags: false, isRows: false, ...extra });
    const sections = [
      sec('experience', { isEntries: true, entries: D.experience.map(e => ({ title: e.role, sub: e.org, period: e.period, bullets: e.bullets })) }),
      sec('education', { isEntries: true, entries: D.education.map(e => ({ title: e.degree, sub: e.org, period: e.period, bullets: e.note ? [e.note] : [] })) }),
      sec('interests', { isTags: true, tags: D.interests }),
      sec('projects', { isEntries: true, entries: D.projects.map(p => ({ title: p.title, sub: p.sponsor, period: p.period, bullets: [p.role] })) }),
      sec('skills', { isRows: true, rows: D.skills.map(s => ({ k: s.group, v: s.items.join(', '), sub: '', hasSub: false })) }),
      sec('awards', { isRows: true, rows: D.awards.map(a => ({ k: a.year, v: a.title, sub: a.org, hasSub: true })) })
    ];
    const metrics = [
      { value: String(C.papers), label: L.mPapers }, { value: String(C.firstAuthor), label: L.mFirst },
      { value: String(C.patentsFiled), label: L.mFiled }, { value: String(C.registered), label: L.mRegistered }
    ];
    const jumps = groups.map((g, i) => ({ num: '0' + (i + 1), label: g.label, count: g.count, unit: g.unitPl, href: '#' + g.anchor }));
    const nav = [
      { label: L.profile, href: '#' + idp + 'profile' }, { label: L.summary, href: '#' + idp + 'summary' },
      ...sections.map(s => ({ label: s.label, href: '#' + s.id })),
      ...blocks.map(b => ({ label: b.label, href: '#' + b.id }))
    ];
    return { L, p: D.person, profile: D.profile, metrics, jumps, sections, blocks, nav, ids: { profile: idp + 'profile', summary: idp + 'summary' }, summaryHref: '#' + idp + 'summary' };
  }

  // Resolve the photo once; '' → placeholder is shown instead.
  let photoSrc = null; const waiters = [];
  fetch(DATA.person.photo, { method: 'HEAD' }).then(r => r.ok ? DATA.person.photo : '').catch(() => '')
    .then(src => { photoSrc = src; waiters.splice(0).forEach(f => f(src)); });
  const onPhoto = f => photoSrc === null ? waiters.push(f) : f(photoSrc);
  window.CV = { LABELS, DATA, view, onPhoto };
})();
