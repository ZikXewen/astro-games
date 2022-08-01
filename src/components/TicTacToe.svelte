<script>
  let state = [...Array(9)].map((_) => ({ char: '', color: 'bg-slate-800' }))
  let turn = 0
  let ended = false

  function check(a, b, c) {
    if (
      state[a].char !== '' &&
      state[a].char === state[b].char &&
      state[b].char === state[c].char
    ) {
      state[a].color = state[b].color = state[c].color = 'bg-green-500'
      ended = true
    }
  }

  function open(no) {
    console.log(state)
    if (ended || state[no].char !== '') return
    state[no].char = turn++ % 2 ? '✕' : 'O'
    check(0, 1, 2)
    check(3, 4, 5)
    check(6, 7, 8)
    check(0, 3, 6)
    check(1, 4, 7)
    check(2, 5, 8)
    check(0, 4, 8)
    check(2, 4, 6)
    state = state
  }

  function init() {
    state = [...Array(9)].map((_) => ({ char: '', color: 'bg-slate-800' }))
    turn = 0
    ended = false
  }

  init()
</script>

<div class="flex-1 flex items-center justify-center">
  <div class="grid grid-cols-3 gap-3 bg-slate-500">
    {#each state as { char, color }, i}
      <button
        class="{color} w-24 h-24 leading-[6rem] text-6xl after:content-['{char}']"
        on:click={() => open(i)}
      />
    {/each}
  </div>
</div>
<button class="w-32 py-2 bg-slate-500 rounded-full mx-auto" on:click={init}
  >Restart</button
>
