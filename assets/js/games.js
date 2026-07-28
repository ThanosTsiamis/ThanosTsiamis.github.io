(function () {
  "use strict";

  function byId(id) {
    return document.getElementById(id);
  }

  var gameZIndex = 60;

  function openGame(windowEl) {
    windowEl.classList.add("show");
    windowEl.setAttribute("aria-hidden", "false");
    windowEl.style.zIndex = String(++gameZIndex);
  }

  function closeGame(windowEl) {
    windowEl.classList.remove("show");
    windowEl.setAttribute("aria-hidden", "true");
  }

  function makeDraggable(windowEl) {
    var handle = windowEl.querySelector(".game-titlebar");
    var drag = null;

    windowEl.addEventListener("pointerdown", function () {
      windowEl.style.zIndex = String(++gameZIndex);
    });

    handle.addEventListener("pointerdown", function (event) {
      if (event.target.closest("button")) return;
      var rect = windowEl.getBoundingClientRect();
      drag = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      handle.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    handle.addEventListener("pointermove", function (event) {
      if (!drag) return;
      var maxLeft = Math.max(0, window.innerWidth - windowEl.offsetWidth);
      var maxTop = Math.max(0, window.innerHeight - windowEl.offsetHeight - 42);
      windowEl.style.left = Math.min(maxLeft, Math.max(0, event.clientX - drag.x)) + "px";
      windowEl.style.top = Math.min(maxTop, Math.max(0, event.clientY - drag.y)) + "px";
    });

    handle.addEventListener("pointerup", function () {
      drag = null;
    });
  }

  // Minesweeper
  var mineWindow = byId("minesweeper-window");
  var mineGrid = byId("mine-grid");
  var mineCountEl = byId("mine-count");
  var mineTimerEl = byId("mine-timer");
  var mineStatus = byId("mine-status");
  var mineReset = byId("mine-reset");
  var mineFlagMode = byId("mine-flag-mode");
  var mineRows = 9;
  var mineColumns = 9;
  var mineTotal = 10;
  var mineBoard = [];
  var mineStarted = false;
  var mineFinished = false;
  var mineSeconds = 0;
  var mineTimer = null;
  var flagMode = false;

  function mineIndex(row, column) {
    return row * mineColumns + column;
  }

  function mineNeighbors(index) {
    var row = Math.floor(index / mineColumns);
    var column = index % mineColumns;
    var neighbors = [];
    for (var rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (var columnOffset = -1; columnOffset <= 1; columnOffset++) {
        if (rowOffset === 0 && columnOffset === 0) continue;
        var nextRow = row + rowOffset;
        var nextColumn = column + columnOffset;
        if (nextRow >= 0 && nextRow < mineRows && nextColumn >= 0 && nextColumn < mineColumns) {
          neighbors.push(mineIndex(nextRow, nextColumn));
        }
      }
    }
    return neighbors;
  }

  function formatCounter(value) {
    var safeValue = Math.max(-99, Math.min(999, value));
    if (safeValue < 0) return "-" + String(Math.abs(safeValue)).padStart(2, "0");
    return String(safeValue).padStart(3, "0");
  }

  function stopMineTimer() {
    if (mineTimer) window.clearInterval(mineTimer);
    mineTimer = null;
  }

  function newMineGame() {
    stopMineTimer();
    mineBoard = [];
    for (var i = 0; i < mineRows * mineColumns; i++) {
      mineBoard.push({ mine: false, revealed: false, flagged: false, adjacent: 0 });
    }
    mineStarted = false;
    mineFinished = false;
    mineSeconds = 0;
    flagMode = false;
    mineReset.textContent = "🙂";
    mineStatus.textContent = "Clear the field without hitting a mine.";
    mineFlagMode.textContent = "🚩 Flag mode: off";
    mineFlagMode.setAttribute("aria-pressed", "false");
    renderMineBoard();
  }

  function plantMines(firstIndex) {
    var excluded = mineNeighbors(firstIndex);
    excluded.push(firstIndex);
    var candidates = [];
    for (var i = 0; i < mineBoard.length; i++) {
      if (excluded.indexOf(i) === -1) candidates.push(i);
    }
    for (var j = candidates.length - 1; j > 0; j--) {
      var randomIndex = Math.floor(Math.random() * (j + 1));
      var temporary = candidates[j];
      candidates[j] = candidates[randomIndex];
      candidates[randomIndex] = temporary;
    }
    candidates.slice(0, mineTotal).forEach(function (index) {
      mineBoard[index].mine = true;
    });
    mineBoard.forEach(function (cell, index) {
      cell.adjacent = mineNeighbors(index).filter(function (neighborIndex) {
        return mineBoard[neighborIndex].mine;
      }).length;
    });
  }

  function startMineTimer(firstIndex) {
    plantMines(firstIndex);
    mineStarted = true;
    mineTimer = window.setInterval(function () {
      mineSeconds = Math.min(999, mineSeconds + 1);
      mineTimerEl.textContent = formatCounter(mineSeconds);
    }, 1000);
  }

  function revealMineCell(index) {
    var cell = mineBoard[index];
    if (!cell || cell.revealed || cell.flagged || mineFinished) return;
    if (!mineStarted) startMineTimer(index);
    cell.revealed = true;

    if (cell.mine) {
      mineFinished = true;
      stopMineTimer();
      mineReset.textContent = "😵";
      mineStatus.textContent = "Boom! Select the face to try again.";
      mineBoard.forEach(function (boardCell) {
        if (boardCell.mine) boardCell.revealed = true;
      });
      renderMineBoard();
      return;
    }

    if (cell.adjacent === 0) {
      mineNeighbors(index).forEach(revealMineCell);
    }

    var safeCellsRevealed = mineBoard.filter(function (boardCell) {
      return boardCell.revealed && !boardCell.mine;
    }).length;
    if (safeCellsRevealed === mineBoard.length - mineTotal) {
      mineFinished = true;
      stopMineTimer();
      mineReset.textContent = "😎";
      mineStatus.textContent = "Field cleared! You win.";
      mineBoard.forEach(function (boardCell) {
        if (boardCell.mine) boardCell.flagged = true;
      });
    }
    renderMineBoard();
  }

  function toggleMineFlag(index) {
    var cell = mineBoard[index];
    if (!cell || cell.revealed || mineFinished) return;
    cell.flagged = !cell.flagged;
    renderMineBoard();
  }

  function renderMineBoard() {
    var flagged = mineBoard.filter(function (cell) { return cell.flagged; }).length;
    mineCountEl.textContent = formatCounter(mineTotal - flagged);
    mineTimerEl.textContent = formatCounter(mineSeconds);
    mineGrid.innerHTML = "";

    mineBoard.forEach(function (cell, index) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "mine-cell";
      button.setAttribute("data-mine-index", String(index));
      if (cell.revealed) {
        button.classList.add("revealed");
        if (cell.mine) {
          button.textContent = "💣";
          button.setAttribute("aria-label", "Mine");
        } else if (cell.adjacent) {
          button.textContent = String(cell.adjacent);
          button.classList.add("mine-number-" + cell.adjacent);
          button.setAttribute("aria-label", cell.adjacent + " adjacent mines");
        } else {
          button.setAttribute("aria-label", "Empty revealed cell");
        }
      } else if (cell.flagged) {
        button.textContent = "🚩";
        button.setAttribute("aria-label", "Flagged hidden cell");
      } else {
        button.setAttribute("aria-label", "Hidden cell");
      }
      mineGrid.appendChild(button);
    });
  }

  mineGrid.addEventListener("click", function (event) {
    var cell = event.target.closest("[data-mine-index]");
    if (!cell) return;
    var index = Number(cell.getAttribute("data-mine-index"));
    if (flagMode) toggleMineFlag(index);
    else revealMineCell(index);
  });

  mineGrid.addEventListener("contextmenu", function (event) {
    var cell = event.target.closest("[data-mine-index]");
    if (!cell) return;
    event.preventDefault();
    toggleMineFlag(Number(cell.getAttribute("data-mine-index")));
  });

  mineFlagMode.addEventListener("click", function () {
    flagMode = !flagMode;
    mineFlagMode.textContent = "🚩 Flag mode: " + (flagMode ? "on" : "off");
    mineFlagMode.setAttribute("aria-pressed", flagMode ? "true" : "false");
  });

  mineReset.addEventListener("click", newMineGame);
  byId("icon-minesweeper").addEventListener("click", function () { openGame(mineWindow); });
  byId("start-minesweeper").addEventListener("click", function () { openGame(mineWindow); });
  byId("minesweeper-close").addEventListener("click", function () { closeGame(mineWindow); });

  // Solitaire
  var solitaireWindow = byId("solitaire-window");
  var solitaireStockEl = byId("solitaire-stock");
  var solitaireWasteEl = byId("solitaire-waste");
  var solitaireTableauEl = byId("solitaire-tableau");
  var solitaireStatus = byId("solitaire-status");
  var suits = ["♠", "♥", "♦", "♣"];
  var rankLabels = { 1: "A", 11: "J", 12: "Q", 13: "K" };
  var solitaire = null;

  function rankLabel(rank) {
    return rankLabels[rank] || String(rank);
  }

  function cardColor(card) {
    return card.suit === "♥" || card.suit === "♦" ? "red" : "black";
  }

  function makeDeck() {
    var deck = [];
    suits.forEach(function (suit) {
      for (var rank = 1; rank <= 13; rank++) {
        deck.push({ suit: suit, rank: rank, faceUp: false });
      }
    });
    for (var i = deck.length - 1; i > 0; i--) {
      var randomIndex = Math.floor(Math.random() * (i + 1));
      var temporary = deck[i];
      deck[i] = deck[randomIndex];
      deck[randomIndex] = temporary;
    }
    return deck;
  }

  function newSolitaireGame() {
    var deck = makeDeck();
    var tableau = [[], [], [], [], [], [], []];
    for (var column = 0; column < 7; column++) {
      for (var row = 0; row <= column; row++) {
        var card = deck.pop();
        card.faceUp = row === column;
        tableau[column].push(card);
      }
    }
    solitaire = {
      stock: deck,
      waste: [],
      foundations: [[], [], [], []],
      tableau: tableau,
      selected: null
    };
    solitaireStatus.textContent = "Build down in alternating colors. Move aces to the foundations.";
    renderSolitaire();
  }

  function createCardButton(card, attributes, selected) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "playing-card";
    Object.keys(attributes).forEach(function (name) {
      button.setAttribute(name, String(attributes[name]));
    });
    if (!card.faceUp) {
      button.classList.add("card-back");
      button.setAttribute("aria-label", "Face-down card");
      return button;
    }
    button.classList.add("card-" + cardColor(card));
    if (selected) button.classList.add("selected");
    button.innerHTML =
      "<span class='card-corner'>" + rankLabel(card.rank) + "<br>" + card.suit + "</span>" +
      "<span class='card-suit'>" + card.suit + "</span>";
    button.setAttribute("aria-label", rankLabel(card.rank) + " of " + card.suit);
    return button;
  }

  function isSelected(source, pile, index) {
    var selected = solitaire.selected;
    if (!selected || selected.source !== source) return false;
    if (source === "tableau") return selected.pile === pile && index >= selected.index;
    return selected.pile === pile;
  }

  function renderSolitaire() {
    solitaireStockEl.classList.toggle("card-back", solitaire.stock.length > 0);
    solitaireStockEl.classList.toggle("empty-stock", solitaire.stock.length === 0);
    solitaireStockEl.setAttribute("aria-label", solitaire.stock.length ? "Draw from stock" : "Recycle waste into stock");

    solitaireWasteEl.innerHTML = "";
    if (solitaire.waste.length) {
      var wasteCard = solitaire.waste[solitaire.waste.length - 1];
      solitaireWasteEl.appendChild(createCardButton(wasteCard, { "data-source": "waste" }, isSelected("waste", 0, 0)));
    }

    Array.prototype.slice.call(document.querySelectorAll(".foundation-slot")).forEach(function (slot, index) {
      slot.innerHTML = "";
      var foundation = solitaire.foundations[index];
      if (foundation.length) {
        var foundationCard = foundation[foundation.length - 1];
        slot.appendChild(createCardButton(
          foundationCard,
          { "data-source": "foundation", "data-pile": index },
          isSelected("foundation", index, 0)
        ));
      } else {
        slot.textContent = "A";
      }
    });

    solitaireTableauEl.innerHTML = "";
    solitaire.tableau.forEach(function (column, columnIndex) {
      var columnEl = document.createElement("div");
      columnEl.className = "tableau-column";
      columnEl.setAttribute("data-tableau", String(columnIndex));
      columnEl.setAttribute("aria-label", "Tableau column " + (columnIndex + 1));
      column.forEach(function (card, cardIndex) {
        var button = createCardButton(
          card,
          { "data-source": "tableau", "data-pile": columnIndex, "data-card-index": cardIndex },
          isSelected("tableau", columnIndex, cardIndex)
        );
        var offset = 0;
        for (var previous = 0; previous < cardIndex; previous++) {
          offset += column[previous].faceUp ? 25 : 14;
        }
        button.style.top = offset + "px";
        columnEl.appendChild(button);
      });
      solitaireTableauEl.appendChild(columnEl);
    });
  }

  function validTableauStack(column, startIndex) {
    for (var i = startIndex; i < column.length - 1; i++) {
      if (cardColor(column[i]) === cardColor(column[i + 1])) return false;
      if (column[i].rank !== column[i + 1].rank + 1) return false;
    }
    return true;
  }

  function selectedCards() {
    var selected = solitaire.selected;
    if (!selected) return [];
    if (selected.source === "waste") return [solitaire.waste[solitaire.waste.length - 1]];
    if (selected.source === "foundation") {
      var foundation = solitaire.foundations[selected.pile];
      return [foundation[foundation.length - 1]];
    }
    return solitaire.tableau[selected.pile].slice(selected.index);
  }

  function removeSelectedCards() {
    var selected = solitaire.selected;
    var cards;
    if (selected.source === "waste") cards = [solitaire.waste.pop()];
    else if (selected.source === "foundation") cards = [solitaire.foundations[selected.pile].pop()];
    else cards = solitaire.tableau[selected.pile].splice(selected.index);
    solitaire.selected = null;
    return cards;
  }

  function flipExposedCard() {
    solitaire.tableau.forEach(function (column) {
      if (column.length && !column[column.length - 1].faceUp) {
        column[column.length - 1].faceUp = true;
      }
    });
  }

  function tryMoveToTableau(columnIndex) {
    if (!solitaire.selected) return false;
    if (solitaire.selected.source === "tableau" && solitaire.selected.pile === columnIndex) {
      solitaire.selected = null;
      return false;
    }
    var cards = selectedCards();
    var movingCard = cards[0];
    var destination = solitaire.tableau[columnIndex];
    var destinationCard = destination[destination.length - 1];
    var legal = destinationCard
      ? destinationCard.faceUp && destinationCard.rank === movingCard.rank + 1 &&
        cardColor(destinationCard) !== cardColor(movingCard)
      : movingCard.rank === 13;
    if (!legal) {
      solitaireStatus.textContent = "That card cannot move there.";
      return false;
    }
    Array.prototype.push.apply(destination, removeSelectedCards());
    flipExposedCard();
    solitaireStatus.textContent = "Move accepted.";
    renderSolitaire();
    return true;
  }

  function tryMoveToFoundation(foundationIndex) {
    var cards = selectedCards();
    if (cards.length !== 1) {
      solitaireStatus.textContent = "Only one card can move to a foundation.";
      return false;
    }
    var card = cards[0];
    var foundation = solitaire.foundations[foundationIndex];
    var top = foundation[foundation.length - 1];
    var legal = top ? top.suit === card.suit && card.rank === top.rank + 1 : card.rank === 1;
    if (!legal) {
      solitaireStatus.textContent = "Foundations build upward by suit, starting with an ace.";
      return false;
    }
    foundation.push(removeSelectedCards()[0]);
    flipExposedCard();
    var foundationCount = solitaire.foundations.reduce(function (total, pile) {
      return total + pile.length;
    }, 0);
    solitaireStatus.textContent = foundationCount === 52 ? "You won! Start a new deal to play again." : "Card moved to foundation.";
    renderSolitaire();
    return true;
  }

  solitaireStockEl.addEventListener("click", function () {
    solitaire.selected = null;
    if (solitaire.stock.length) {
      var card = solitaire.stock.pop();
      card.faceUp = true;
      solitaire.waste.push(card);
      solitaireStatus.textContent = "Drew a card.";
    } else if (solitaire.waste.length) {
      while (solitaire.waste.length) {
        var recycled = solitaire.waste.pop();
        recycled.faceUp = false;
        solitaire.stock.push(recycled);
      }
      solitaireStatus.textContent = "Waste recycled into the stock.";
    }
    renderSolitaire();
  });

  solitaireWasteEl.addEventListener("click", function () {
    if (!solitaire.waste.length) return;
    solitaire.selected = solitaire.selected && solitaire.selected.source === "waste"
      ? null
      : { source: "waste", pile: 0, index: solitaire.waste.length - 1 };
    renderSolitaire();
  });

  document.querySelector(".solitaire-top").addEventListener("click", function (event) {
    var foundation = event.target.closest("[data-foundation]");
    if (!foundation) return;
    var foundationIndex = Number(foundation.getAttribute("data-foundation"));
    if (solitaire.selected) {
      tryMoveToFoundation(foundationIndex);
    } else if (solitaire.foundations[foundationIndex].length) {
      solitaire.selected = { source: "foundation", pile: foundationIndex, index: solitaire.foundations[foundationIndex].length - 1 };
      renderSolitaire();
    }
  });

  solitaireTableauEl.addEventListener("click", function (event) {
    var columnEl = event.target.closest("[data-tableau]");
    if (!columnEl) return;
    var columnIndex = Number(columnEl.getAttribute("data-tableau"));
    var cardEl = event.target.closest("[data-source='tableau']");

    if (solitaire.selected) {
      tryMoveToTableau(columnIndex);
      renderSolitaire();
      return;
    }
    if (!cardEl) return;

    var cardIndex = Number(cardEl.getAttribute("data-card-index"));
    var column = solitaire.tableau[columnIndex];
    var card = column[cardIndex];
    if (!card.faceUp) {
      if (cardIndex === column.length - 1) {
        card.faceUp = true;
        solitaireStatus.textContent = "Card revealed.";
        renderSolitaire();
      }
      return;
    }
    if (validTableauStack(column, cardIndex)) {
      solitaire.selected = { source: "tableau", pile: columnIndex, index: cardIndex };
      renderSolitaire();
    }
  });

  byId("solitaire-new").addEventListener("click", newSolitaireGame);
  byId("icon-solitaire").addEventListener("click", function () { openGame(solitaireWindow); });
  byId("start-solitaire").addEventListener("click", function () { openGame(solitaireWindow); });
  byId("solitaire-close").addEventListener("click", function () { closeGame(solitaireWindow); });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeGame(mineWindow);
      closeGame(solitaireWindow);
    }
  });

  makeDraggable(mineWindow);
  makeDraggable(solitaireWindow);
  newMineGame();
  newSolitaireGame();
})();
