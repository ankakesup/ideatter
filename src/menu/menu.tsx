import './menu.css'

function Menu() {
  return (
    <div className="menu-container">
      <nav className="menu">
        <ul>
          {/* マーカーを画像にしたい */}
          <li><a href="#community">みんなのアイデア</a></li>
          <li><a href="#myideas">わたしのアイデア</a></li>
          <li><a href="#create">アイデアを作る</a></li>
          <li><a href="#howToCreate">アイデアの作り方</a></li>
          <li><a href="profile">プロフィール</a></li>
          <li><a href="#setting">設定</a></li>
        </ul>
      </nav>
    </div>
  )
}

export default Menu
