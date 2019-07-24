import store from'./store';

export default{
    hasRight(right){
        return store.state.authorityContent.includes(right)
    }
}