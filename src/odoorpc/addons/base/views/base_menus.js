export default {
  views: {},

  actions: {},

  menus: {
    menu_board_root: {
      name: 'Dashboards',
      //   icon: 'shopping',
      //   theme: 'twoTone',
      active: false,
      sequence: 260
    },

    menu_administration: {
      name: '设置',
      sequence: 550
    },

    menu_management: {
      name: '模块',
      sequence: 500
    },

    menu_users: {
      parent: 'menu_administration',
      name: '用户和公司',
      sequence: 1
    }
  }
}
