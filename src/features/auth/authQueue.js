let queue = [];

export function addPending(item) {
    queue.push(item);
}

export function hasPending() {
    return queue.length > 0;
}

export function runPending() {
    const items = queue;
    queue = [];
    items.forEach((i) => i.run());
}

export function cancelPending() {
    const items = queue;
    queue = [];
    items.forEach((i) => i.cancel?.());
}