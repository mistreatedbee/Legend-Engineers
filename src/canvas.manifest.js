export const manifest = {
  screens: {
    scr_kwpbnl: { name: "Hero", route: "/", position: { "x": 160, "y": 220 } },
    scr_o6q3xt: { name: "About", route: "/#about", position: { "x": 1560, "y": 220 } },
    scr_qo1rw4: { name: "Services", route: "/#services", position: { "x": 2960, "y": 220 } },
    scr_1ctw6t: { name: "Projects", route: "/#projects", position: { "x": 4360, "y": 220 } },
    scr_j29aiu: { name: "Equipment", route: "/#equipment", position: { "x": 5760, "y": 220 } },
    scr_xz1e3b: { name: "Booking", route: "/#booking", position: { "x": 160, "y": 2200 } },
    scr_qzrr0s: { name: "Quotation", route: "/#quote", position: { "x": 1560, "y": 2200 } },
    scr_rcm3nr: { name: "Contact", route: "/#contact", position: { "x": 2960, "y": 2200 } }
  },
  sections: {
    sec_koduki: { name: "Landing & Information", x: 0, y: 0, width: 7120, height: 1180 },
    sec_t5gr4c: { name: "Conversion Flow", x: 0, y: 1980, width: 4320, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_koduki", children: [
    { kind: "screen", id: "scr_kwpbnl" },
    { kind: "screen", id: "scr_o6q3xt" },
    { kind: "screen", id: "scr_qo1rw4" },
    { kind: "screen", id: "scr_1ctw6t" },
    { kind: "screen", id: "scr_j29aiu" }]
  },
  { kind: "section", id: "sec_t5gr4c", children: [
    { kind: "screen", id: "scr_xz1e3b" },
    { kind: "screen", id: "scr_qzrr0s" },
    { kind: "screen", id: "scr_rcm3nr" }]
  }]

};