<template>
  <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="is-button-item is-text-light navbar-item" href="/">
        MH: Rise Leaderboard
      </a>

      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
        onclick="document.querySelector('.navbar-menu').classList.toggle('is-active');"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
        <!--<a class="navbar-item" href="/">Home</a>-->
        <a class="navbar-item" href="/monsters">Monsters</a>
        <a class="navbar-item" href="/quests">Quests</a>
        <a class="navbar-item" href="/runners">Runners</a>
        <a class="navbar-item" href="/rules">Rules</a>
        <a class="navbar-item" href="/submissions">Submit</a>
        <a class="navbar-item" href="/queue">Queue</a>
        <!--<a class="navbar-item" href="/about">About</a>-->
        <!--<a class="navbar-item" href="/login">Login</a>-->
      </div>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <a class="button is-primary" href="/login">
            Log in
          </a>
          <!--<a class="button is-info" href="/dashboard">
            Dashboard
          </a>
          <a class="button is-warning" href="/logout">
            Log out
          </a>-->
        </div>
      </div>
    </div>
  </nav>
  <router-view />
</template>
