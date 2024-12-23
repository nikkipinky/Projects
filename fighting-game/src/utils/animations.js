export function switchSprite(character, state) {
    const animation = character.animations[state];
    if (animation) {
        character.image.src = `assets/images/${animation}`;
    }
}
