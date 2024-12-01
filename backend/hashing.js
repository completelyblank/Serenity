class Node {
    constructor(data) {
      this.data = data;
      this.next = null;
    }
  }
  
  class LinkedList {
    constructor() {
      this.head = null;
    }
  
    add(data) {
      let newNode = new Node(data);
      if (!this.head) {
        this.head = newNode;
      } else {
        let current = this.head;
        while (current.next) {
          current = current.next;
        }
        current.next = newNode;
      }
    }
  
    toArray() {
      let arr = [];
      let current = this.head;
      while (current) {
        arr.push(current.data);
        current = current.next;
      }
      return arr;
    }
  }
  
  function linkedListHash(linkedList) {
    const dataArray = linkedList.toArray();
    let hash = 0x811c9dc5; // FNV-1a offset basis
    const prime = 0x01000193; // FNV-1a prime
    
    for (let i = 0; i < dataArray.length; i++) {
      const charCode = dataArray[i].charCodeAt(0); 
      hash ^= charCode; // XOR with the character code
      hash *= prime; // Multiply by the prime number
      hash &= 0xffffffff; // Keep the result within 32-bits
    }
    
    return hash;
  }
  
  module.exports = { LinkedList, linkedListHash };
  