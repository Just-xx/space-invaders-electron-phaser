
import ObstacleSprite from "./ObstacleSprite";

class ObstaclesGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);
    this.scene = scene;
    this.createGroups();
  }

  createCluster() {
    let cluster = [];

    const obstacleSprite = this.addPart(0, 0);

    const obstacleWidth = obstacleSprite.displayWidth;
    const obstacleHeight = obstacleSprite.displayHeight;
    cluster.push(obstacleSprite);

    let y, x;
    for (let i = 0; i <= 4; i++) {
      x = obstacleWidth * i;
      for (let j = 0; j <= 4; j++) {
        if (j === 0 && i === 0) continue;
        if (j === 0 && i === 4) continue;
        if (j === 3 && i === 2) continue;
        if (j === 4 && i <= 3 && i >= 1) continue;
        y = obstacleHeight * j;
        const part = this.addPart(x, y);
        cluster.push(part);
      }
    }

    cluster[0].destroy();
    cluster.shift();

    return cluster;
  }

  addPart(x, y) {
    const obstacleSprite = new ObstacleSprite(this.scene, x, y);
    this.add(obstacleSprite);
    obstacleSprite.body.allowGravity = false;
    return obstacleSprite;
  }

  moveToPostion(cluster, pos) {

    const obstacleClusterWidth = cluster[0].displayWidth * 5;
    const obstacleClusterHeight = cluster[0].displayHeight * 5;

    const spacingX = this.scene.scale.width / 3 - obstacleClusterWidth * 1.5;
    const spacingY = this.scene.player.y - obstacleClusterHeight - 64;

    cluster.forEach(part => {
      part.x = part.x + spacingX * pos;
      part.y = part.y + spacingY;
    })
    
  }

  createGroups() {
    this.clusters = [this.createCluster(), this.createCluster(), this.createCluster()];
    this.clusters.forEach((cluster, i) => this.moveToPostion(cluster, i+1))
  }

  onHit(part) {
    part.destroy();
  }
}

export default ObstaclesGroup;
