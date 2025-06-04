const managerMenu = {
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
            url: '/manager/app/dashboard'
          },
                  {
            id: 'Loans',
            title: 'Paneli Kredive',
            type: 'item',
            icon: 'feather icon-credit-card',
            url: '/manager/app/loans'
          },
          {
            id: 'Officer',
            title: 'Paneli Oficerav',
            type: 'item',
            icon: 'feather icon-file-plus',
            url: '/manager/app/register'
          }
        ]
      },
      
    ]
  };
  
  export default managerMenu;