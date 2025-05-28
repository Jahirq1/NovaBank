const managerMenu = {
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
            url: '/manager/app/dashboard'
          },
                  {
            id: 'Loans',
            title: 'Loans',
            type: 'item',
            icon: 'feather icon-credit-card',
            url: '/manager/app/loans'
          },
          {
            id: 'Officer',
            title: 'Add Officer',
            type: 'item',
            icon: 'feather icon-file-plus',
            url: '/manager/app/register'
          }
        ]
      },
      
    ]
  };
  
  export default managerMenu;