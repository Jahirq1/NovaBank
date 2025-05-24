const userMenu = {
    items: [
      {
        id: 'navigation',
        type: 'group',
        children: [
          {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            icon: 'feather icon-home',
            url: '/user/app/dashboard'
          },
                  {
            id: 'balance',
            title: 'Balance',
            type: 'item',
            icon: 'feather icon-credit-card',
            url: '/user/app/balance'
          },
          {
            id: 'Transaksionet',
            title: 'Transaksionet',
            type: 'item',
            icon: 'feather icon-file-plus',
            url: '/user/app/transaction'
          },
          {
            id: 'account',
            title: 'Profile',
            type: 'item',
            icon: 'feather icon-user',
            url: '/user/app/profile'
          }
        ]
      },
      
    ]
  };
  
  export default userMenu;