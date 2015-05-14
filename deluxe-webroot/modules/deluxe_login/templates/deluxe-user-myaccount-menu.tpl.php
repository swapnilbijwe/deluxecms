<div class="control-panel">
<div class="info-panel clearfix">
    <div class="user-name">Hello, <span id="UserFirstName">Guest</span></div>
    <div class="my-account has-dropdown" id="login-dropdown">
        <a onclick="return false;" href="/myaccount">My Account</a>
        <div class="dropdown">
            <?php print $user_menu_data['menu_list']; ?>
            <div class="arrow-top"></div>
        </div>
    </div>
    <div class="cart">
        <a href="/shoppingcart">
            Cart (<span id="CartItemsCount">0</span>)
        </a>
    </div>
    <div class="phone">800.511.2009</div>
</div>
</div>
