/**
 * Inspiration Service - LocalStorage Implementation
 * This service handles design boards and favorited images without a backend.
 */

const STORAGE_KEY = 'houspire_user_boards';

/**
 * Get user's inspiration boards
 */
export async function getInspirationBoards() {
  if (typeof window === 'undefined') return [];
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    
    const boards = JSON.parse(saved);
    return boards.map(board => ({
      ...board,
      image_count: board.items?.length || 0,
      cover_image: board.items?.[0]?.image_url || null
    }));
  } catch (error) {
    console.error('Error fetching boards:', error);
    return [];
  }
}

/**
 * Get or create default board
 */
export async function getOrCreateDefaultBoard() {
  const boards = await getInspirationBoards();
  const defaultBoard = boards.find(b => b.is_default);
  
  if (defaultBoard) return defaultBoard;
  
  // Create default board if none exists
  return await createBoard('My Inspiration', 'My saved design ideas', true);
}

/**
 * Create new board
 */
export async function createBoard(name, description = '', isDefault = false) {
  if (typeof window === 'undefined') return null;

  try {
    const boards = await getInspirationBoards();
    
    const newBoard = {
      id: Date.now(),
      name,
      description,
      is_default: isDefault,
      isSecret: false,
      createdAt: new Date().toISOString(),
      items: []
    };
    
    const updatedBoards = [newBoard, ...boards];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBoards));
    
    window.dispatchEvent(new Event('boardsUpdated'));
    
    return { ...newBoard, image_count: 0 };
  } catch (error) {
    console.error('Error creating board:', error);
    return null;
  }
}

/**
 * Save image to board
 */
export async function saveToBoard(boardId, imageUrl, sourceType, metadata) {
  if (typeof window === 'undefined') return false;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    let boards = saved ? JSON.parse(saved) : [];
    
    const boardIndex = boards.findIndex(b => b.id === boardId);
    if (boardIndex === -1) return false;
    
    // Initialize items array if it doesn't exist
    if (!boards[boardIndex].items) boards[boardIndex].items = [];
    
    // Check if already in this board
    const exists = boards[boardIndex].items.some(item => item.image_url === imageUrl);
    if (exists) return true; // Already saved
    
    const newItem = {
      id: Date.now(),
      image_url: imageUrl,
      source_type: sourceType,
      source_id: metadata?.sourceId,
      title: metadata?.title,
      notes: metadata?.notes,
      room_type: metadata?.roomType,
      style: metadata?.style,
      created_at: new Date().toISOString()
    };
    
    boards[boardIndex].items.unshift(newItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
    
    window.dispatchEvent(new Event('boardsUpdated'));
    
    return true;
  } catch (error) {
    console.error('Error saving to board:', error);
    return false;
  }
}

/**
 * Remove image from board
 */
export async function removeFromBoard(inspirationId) {
  // Note: For simplicity, we search all boards for this item ID
  if (typeof window === 'undefined') return false;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return false;
    
    const boards = JSON.parse(saved);
    let modified = false;
    
    const updatedBoards = boards.map(board => {
      const newItems = board.items?.filter(item => item.id !== inspirationId);
      if (newItems?.length !== board.items?.length) {
        modified = true;
        return { ...board, items: newItems };
      }
      return board;
    });
    
    if (modified) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBoards));
      window.dispatchEvent(new Event('boardsUpdated'));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error removing from board:', error);
    return false;
  }
}

/**
 * Check if image is saved by user
 */
export async function isImageSaved(imageUrl) {
  if (typeof window === 'undefined') return { saved: false };

  try {
    const boards = await getInspirationBoards();
    for (const board of boards) {
      if (board.items?.some(item => item.image_url === imageUrl)) {
        return { saved: true, boardId: board.id };
      }
    }
    return { saved: false };
  } catch (error) {
    return { saved: false };
  }
}

/**
 * Get images in a board
 */
export async function getBoardImages(boardId) {
  try {
    const boards = await getInspirationBoards();
    const board = boards.find(b => b.id === boardId);
    return board?.items || [];
  } catch (error) {
    console.error('Error fetching board images:', error);
    return [];
  }
}

/**
 * Update board details
 */
export async function updateBoard(boardId, updates) {
  if (typeof window === 'undefined') return false;
  
  try {
    const boards = await getInspirationBoards();
    const updatedBoards = boards.map(b => b.id === boardId ? { ...b, ...updates } : b);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBoards));
    window.dispatchEvent(new Event('boardsUpdated'));
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Delete board
 */
export async function deleteBoard(boardId) {
  if (typeof window === 'undefined') return false;
  
  try {
    const boards = await getInspirationBoards();
    const updatedBoards = boards.filter(b => b.id !== boardId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBoards));
    window.dispatchEvent(new Event('boardsUpdated'));
    return true;
  } catch (error) {
    return false;
  }
}

// Mock designer-facing functions as no-ops
export async function linkBoardToOrder() { return true; }
export async function unlinkBoardFromOrder() { return true; }
export async function getOrderInspirationBoards() { return []; }
export async function getOrderInspirationImages() { return []; }
