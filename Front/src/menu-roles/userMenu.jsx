const userMenu = {
    items: [
      {
        id: 'navigation',
        type: 'group',
        children: [
          {
            id: 'dashboard',
            title: 'Paneli Kontrollit',
            type: 'item',
            icon: 'feather icon-home',
            url: '/user/app/dashboard'
          },
                  {
            id: 'balance',
            title: 'Paneli i Balancit',
            type: 'item',
            icon: 'feather icon-credit-card',
            url: '/user/app/balance'
          },
          {
            id: 'Transaksionet',
            title: 'Paneli Transaksioneve',
            type: 'item',
            icon: 'feather icon-file-plus',
            url: '/user/app/transaction'
          }
        ]
      },
      
    ]
  };
  
  export default userMenu;