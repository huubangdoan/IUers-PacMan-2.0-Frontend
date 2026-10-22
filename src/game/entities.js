import{LAYER} from './constants';

class Entity{
    constructer(type, layer, row, col) {
         this.type = type;
         this.layer = layer;
         this.row = row;
         this.col = col;
    }
}