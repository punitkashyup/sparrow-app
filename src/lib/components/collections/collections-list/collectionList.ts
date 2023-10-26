import { collectionList, setCollectionList } from "$lib/store/collection";
/* eslint-disable @typescript-eslint/no-explicit-any */
let tree: any[];

collectionList.subscribe((value: object[]) => {
  tree = JSON.parse(JSON.stringify(value));
});

/**
 * Recursive helper function to modify the tree data structure by adding files or folders.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
const helper: (
  tree: any,
  folderId: string,
  type: string,
  name: string,
  id: string,
  method?: string,
) => number = (tree, folderId, type, name, id, method?) => {
  if (tree._id === folderId || tree.id === folderId) {
    if (type === "REQUEST") {
      tree.items.push({
        id,
        name,
        type,
        request: {
          method: method,
        },
      });
    } else if (type === "FOLDER") {
      tree.items.push({
        id,
        name,
        description: "",
        type,
        items: [],
      });
    }
    return 0;
  }

  // Recursively search through the tree structure
  if (tree && tree.items) {
    for (let j = 0; j < tree.items.length; j++) {
      if (!helper(tree.items[j], folderId, type, name, id, method)) return 0;
    }
  }
  return 1;
};

const createPath: (path: string[]) => string = (path) => {
  const res = "/" + path.join("/");
  return res;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const searchHelper: (
  tree: any,
  searchText: string,
  collection: any[],
  folder: any[],
  file: any[],
  collectionId: string,
  path: string[],
) => void = (
  tree,
  searchText,
  collection,
  folder,
  file,
  collectionId,
  path,
) => {
  if (tree.name.toLowerCase().includes(searchText.toLowerCase())) {
    if (tree.type === "REQUEST") {
      file.push({
        tree: JSON.parse(JSON.stringify(tree)),
        collectionId,
        path: createPath(path),
      });
    } else if (tree.type === "FOLDER") {
      folder.push({ tree: JSON.parse(JSON.stringify(tree)), collectionId });
    } else {
      collection.push({ tree: JSON.parse(JSON.stringify(tree)), collectionId });
    }
  }

  // Recursively search through the tree structure
  if (tree && tree.items) {
    for (let j = 0; j < tree.items.length; j++) {
      path.push(tree.name); // Recursive backtracking
      searchHelper(
        tree.items[j],
        searchText,
        collection,
        folder,
        file,
        collectionId,
        path,
      );
      path.pop();
    }
  }
  return;
};

/**
 * Custom hook function for interacting with the tree data structure.
 */
const useTree = (): any[] => {
  const insertNode: (
    folderId: string,
    type: string,
    name: string,
    id: string,
    method?: string,
  ) => void = (folderId, type, name, id, method?) => {
    // Iterate through the tree to find the target folder and add the item
    for (let i = 0; i < tree.length; i++) {
      if (!helper(tree[i], folderId, type, name, id, method)) {
        setCollectionList(tree);
        return;
      }
    }
    return;
  };
  const insertHead: (name: string, _id: string) => void = (name, _id) => {
    // Iterate through the tree to find the target folder and add the item
    tree.push({ name, _id, items: [] });
    setCollectionList(tree);
    return;
  };
  const searchNode: (
    searchText: string,
    collection: any[],
    folder: any[],
    file: any[],
  ) => void = (searchText, collection, folder, file) => {
    // Iterate through the tree to find the target folder and add the item
    for (let i = 0; i < tree.length; i++) {
      const path = [];
      searchHelper(
        tree[i],
        searchText,
        collection,
        folder,
        file,
        tree[i]._id,
        path,
      );
    }
    return;
  };
  return [insertNode, insertHead, searchNode];
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const getNextName: (list: any[], type: string, name: string) => any = (
  list,
  type,
  name,
) => {
  const isNameAvailable: (proposedName: string) => boolean = (proposedName) => {
    return list.some((element) => {
      return element.type === type && element.name === proposedName;
    });
  };

  if (!isNameAvailable(name)) {
    return name;
  }

  for (let i = 2; i < list.length + 10; i++) {
    const proposedName: string = `${name}${i}`;
    if (!isNameAvailable(proposedName)) {
      return proposedName;
    }
  }

  return null;
};

export { useTree, getNextName };
