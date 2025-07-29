const [treeData, setTreeData] = useState(null);
useEffect(() => {
  fetch("/api/tree")
    .then((res) => res.json())
    .then((data) => setTreeData(data));
}, []);
