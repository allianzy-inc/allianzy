
/**
 * Usage: <div use:portal> or <div use:portal={document.body}>
 * 
 * @param node 
 * @param target 
 */
export function portal(node: HTMLElement, target: HTMLElement | string = 'body') {
    async function update(newTarget: HTMLElement | string) {
        let targetEl: HTMLElement | null;
        
        if (typeof newTarget === 'string') {
            targetEl = document.querySelector(newTarget);
            if (newTarget === 'body') targetEl = document.body;
        } else {
            targetEl = newTarget;
        }

        if (targetEl) {
            targetEl.appendChild(node);
            node.hidden = false;
        }
    }

    function destroy() {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }

    update(target);
    
    return {
        update,
        destroy
    };
}
