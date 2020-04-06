module.exports = (layout, portals = '[]', monsters = '[]') => {
  return (`
module.exports = {
  layout: [
    ${layout}
  ],
  metadata: {
    portals: ${portals},
    monsters: ${monsters},
    adventurers: [],
  },
};
  `);
};
