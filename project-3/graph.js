export function buildGraph(roads){
    return roads.reduce((graph, road) => {
        let [from, to] = road.split("-");
        if (from in graph) {
            graph[from].push(to);
        } else {
            graph[from] = [to]
        }
        if (to in graph) {
            graph[to].push(from);
        } else {
            graph[to] = [from]
        }
        return graph;
    }, {})
}