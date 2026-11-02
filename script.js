// ==========================================================================
// ACCUMULATOR CPU SIMULATOR - CONTROLLER & STEP ENGINE
// --------------------------------------------------------------------------
// Emits CustomEvents ('cpu:step', 'cpu:reset') for backend/lab integration
// while providing built-in interactive execution for immediate UI testing.
// ==========================================================================

let pc = 0;
let acc = 0;
let stepCount = 0;
let isHalted = false;

const stepButton = document.getElementById("step-button");
const resetButton = document.getElementById("reset-button");
const statusMessage = document.getElementById("status-message");
const pcValue = document.getElementById("pc-value");
const accValue = document.getElementById("acc-value");
const stepCountBadge = document.getElementById("step-count");
const historyBody = document.getElementById("history-body");

function formatAddress(addr) {
  return String(addr).padStart(2, "0");
}

function readMemory() {
  const rows = document.querySelectorAll(".memory-table tbody tr");
  return Array.from(rows, function (row, address) {
    return {
      address: address,
      instruction: row.querySelector("select").value,
      value: Number(row.querySelector("input").value)
    };
  });
}

function updateActiveRow(currentAddr) {
  const rows = document.querySelectorAll(".memory-table tbody tr");
  rows.forEach((row, index) => {
    if (index === currentAddr && !isHalted) {
      row.classList.add("active-row");
    } else {
      row.classList.remove("active-row");
    }
  });
}

function appendHistoryRow(stepNum, execPc, instruction, operand, accAfter, status) {
  // Remove empty state placeholder if this is the first step
  if (stepNum === 1) {
    historyBody.innerHTML = "";
  }

  const tr = document.createElement("tr");
  const badgeClass = status === "HALTED" ? "badge-halt" : "badge-ok";

  tr.innerHTML = `
    <td class="history-step-num">#${stepNum}</td>
    <td><span class="address-chip">${formatAddress(execPc)}</span></td>
    <td><span class="history-instruction">${instruction}</span> ${operand}</td>
    <td><strong>${accAfter}</strong></td>
    <td><span class="history-badge ${badgeClass}">${status}</span></td>
  `;

  historyBody.appendChild(tr);
}

// Step Execution
stepButton.addEventListener("click", function () {
  const memory = readMemory();

  // Dispatch event for any connected backend/external script
  document.dispatchEvent(new CustomEvent("cpu:step", { 
    detail: { pc: pc, acc: acc, step: stepCount, memory: memory } 
  }));

  if (isHalted) {
    statusMessage.textContent = `CPU is HALTED at PC ${formatAddress(pc)}. Press Reset to restart execution.`;
    return;
  }

  if (pc < 0 || pc >= memory.length) {
    statusMessage.textContent = `Execution error: PC ${formatAddress(pc)} is out of memory bounds (0-7).`;
    isHalted = true;
    return;
  }

  const currentCell = memory[pc];
  const opcode = currentCell.instruction;
  const operand = currentCell.value;
  const execPc = pc;
  stepCount++;

  let status = "OK";
  let explanation = "";

  switch (opcode) {
    case "LOAD":
      acc = operand;
      explanation = `Loaded ${operand} into ACC.`;
      pc++;
      break;

    case "ADD":
      acc += operand;
      explanation = `Added ${operand} to ACC (result: ${acc}).`;
      pc++;
      break;

    case "SUB":
      acc -= operand;
      explanation = `Subtracted ${operand} from ACC (result: ${acc}).`;
      pc++;
      break;

    case "STORE":
      // Store ACC value into specified memory address
      if (operand >= 0 && operand < memory.length) {
        const targetRow = document.querySelectorAll(".memory-table tbody tr")[operand];
        if (targetRow) {
          const input = targetRow.querySelector("input");
          input.value = acc;
        }
        explanation = `Stored ACC (${acc}) into memory address [${formatAddress(operand)}].`;
      } else {
        explanation = `STORE failed: address [${operand}] out of bounds.`;
      }
      pc++;
      break;

    case "HALT":
      isHalted = true;
      status = "HALTED";
      explanation = `HALT instruction reached. Processor stopped.`;
      break;

    default:
      explanation = `Unknown instruction '${opcode}'.`;
      pc++;
  }

  // Update DOM displays
  pcValue.textContent = formatAddress(isHalted ? execPc : pc);
  accValue.textContent = String(acc);
  stepCountBadge.textContent = `${stepCount} STEP${stepCount === 1 ? '' : 'S'}`;
  statusMessage.textContent = `[Step ${stepCount}] ${opcode} ${operand} → ${explanation}`;

  appendHistoryRow(stepCount, execPc, opcode, operand, acc, status);
  updateActiveRow(pc);
});

// Reset Execution
resetButton.addEventListener("click", function () {
  pc = 0;
  acc = 0;
  stepCount = 0;
  isHalted = false;

  pcValue.textContent = "00";
  accValue.textContent = "0";
  stepCountBadge.textContent = "0 STEPS";
  historyBody.innerHTML = `
    <tr class="empty-history">
      <td colspan="5">
        <span class="empty-history-icon">↗</span>
        <span>Your instruction history will appear here.</span>
        <span class="empty-hint">Press <b>Step</b> to begin</span>
      </td>
    </tr>
  `;
  statusMessage.textContent = "CPU reset to initial state (PC: 00, ACC: 0). Ready to run.";

  updateActiveRow(0);

  // Dispatch reset event for backend
  document.dispatchEvent(new CustomEvent("cpu:reset"));
});
