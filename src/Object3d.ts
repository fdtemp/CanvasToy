/// <reference path="./CanvasToy.ts"/>

namespace CanvasToy {

    /**
     * class Object3d
     * @descripton the base class of transform object
     */
    export class Object3d {

        public tag: string;

        public scene: Scene;

        public children: Array<Object3d> = [];

        public objectToWorldMatrix: Mat4Array = mat4.create();

        protected _parent: Object3d = null;

        protected _localMatrix: Mat4Array = mat4.create();
        protected _matrix: Mat4Array = mat4.create();

        protected _localPosition: Vec3Array = vec3.create();
        protected _localRotation: QuatArray = quat.create();
        protected _localScaling: Vec3Array = vec3.fromValues(1, 1, 1);

        protected _position: Vec3Array = vec3.create();
        protected _scaling: Vec3Array = vec3.fromValues(1, 1, 1);
        protected _rotation: QuatArray = quat.create();

        protected updateEvents: Array<Function> = [];
        protected startEvents: Array<Function> = [];

        /**
         * Create a Object3d instance
         * @param  {string} tag tag of this object
         * @return {[type]}     [description]
         */
        constructor(tag?: string) {
            this.tag = tag;
        }

        /**
         * Get transform parent of this object
         * @return {Object3d} [description]
         */
        public get parent(): Object3d {
            return this._parent;
        }

        /**
         * Set transform parent of this object, will also add this to parent‘s children list automatically
         * @param  {Object3d} _parent
         */
        public set parent(_parent: Object3d) {
            _parent.children.push(this);
            this._parent = _parent;
        }

        /**
         * Get local matrix
         */
        public get localMatrix(): Mat4Array {
            return this._localMatrix;
        }

        /**
         * Get global matrix
         */
        public get matrix(): Mat4Array {
            return this._matrix;
        }

        /**
         * Get local position
         * @return {Vec3Array} [description]
         */
        public get localPosition(): Vec3Array {
            return this._localPosition;
        }

        /**
         * Set position locally
         * @param  {Vec3Array} _localPosition
         */
        public set localPosition(_localPosition: Vec3Array) {
            console.assert(_localPosition && _localPosition.length === 3, "invalid object position paramter");
            this._localPosition = _localPosition;
            this.composeFromLocalMatrix();
            if (!!this._parent) {
                mat4.getTranslation(this._position, this.matrix);
            } else {
                this._position = vec3.clone(_localPosition);
            }
            this.applyToChildren();
        }

        /**
         * Get global position
         */
        public get position(): Vec3Array {
            return this._position;
        }

        /**
         * set position globally
         * @param  {Vec3Array} _position
         */
        public set position(_position: Vec3Array) {
            console.assert(_position && _position.length === 3, "invalid object position paramter");
            this._position = _position;
            this.composeFromGlobalMatrix();
            if (!!this._parent) {
                mat4.getTranslation(this._localPosition, this._localMatrix);
            } else {
                this._localPosition = vec3.clone(_position);
            }
            this.applyToChildren();
        }

        /**
         * Set the rotation globally
         * @param  {QuatArray} _rotation
         */
        public get localRotation(): QuatArray {
            return this._localRotation;
        }

        /**
         * Set the rotation locally
         * @param  {QuatArray} _rotation
         */
        public set localRotation(_localRotation: QuatArray) {
            console.assert(_localRotation && _localRotation.length === 4, "invalid object rotation paramter");
            quat.normalize(_localRotation, quat.clone(_localRotation));
            this._localRotation = _localRotation;
            this.composeFromLocalMatrix();
            if (!!this._parent) {
                mat4.getRotation(this._rotation, this.matrix);
            } else {
                this._rotation = quat.clone(_localRotation);
            }
            this.applyToChildren();
        }

        public get rotation(): QuatArray {
            return this._rotation;
        }

        /**
         * Set the rotation globally
         * @param  {QuatArray} _rotation
         */
        public set rotation(_rotation: QuatArray) {
            console.assert(_rotation && _rotation.length === 4, "invalid object rotation paramter");
            quat.normalize(_rotation, quat.clone(_rotation));
            this._rotation = _rotation;
            this.composeFromGlobalMatrix();
            if (!!this._parent) {
                mat4.getRotation(this._localRotation, this.localMatrix);
            } else {
                this._localRotation = quat.clone(_rotation);
            }
            this.applyToChildren();
        }

        /**
         * Get local scaling factor
         * @return {Vec3Array} the local scaling factor
         */
        public get localScaling(): Vec3Array {
            return this._localScaling;
        }

        /**
         * Set scaling locally
         * @param  {Vec3Array} _localScaling expected local scaling factor
         */
        public set localScaling(_localScaling: Vec3Array) {
            console.assert(_localScaling && _localScaling.length === 3, "invalid object scale paramter");
            this._localScaling = _localScaling;
            if (!!this._parent) {
                vec3.mul(this._scaling, this._parent.scaling, this._localScaling);
            } else {
                this._scaling = vec3.clone(_localScaling);
            }
            this.applyToChildren();
        }

        /**
         * Get global scaling factor.
         * @return {Vec3Array} the global scaling factor
         */
        public get scaling(): Vec3Array {
            return this._scaling;
        }

        /**
         * Set scaling factor globally.
         * @param  {Vec3Array} _scaling the given scaling factor
         */
        public set scaling(_scaling: Vec3Array) {
            console.assert(_scaling && _scaling.length === 3, "invalid object scale paramter");
            this._scaling = _scaling;
            if (!!this._parent) {
                vec3.div(this.localScaling, this.scaling, this._parent.scaling);
            } else {
                this.localScaling = vec3.clone(_scaling);
            }
            this.applyToChildren();
        }

        /**
         * Reset all global transforms { position, rotation, scaling, objectToWorldMatrix }
         * by parent, but keep all local transforms the same before called.
         */
        public setTransformFromParent() {
            if (!!this.parent) {
                this._matrix = mat4.mul(mat4.create(), this.parent.matrix, this.localMatrix);
                this.genOtherMatrixs();
                mat4.getTranslation(this._position, this.matrix);
                mat4.getRotation(this._rotation, this.matrix);
                vec3.mul(this.scaling, this.parent.scaling, this.localScaling);
            }
        }

        /**
         * Add on update function, which will be called at update time;
         * @param  {Function} updateFunction
         */
        public registUpdate(updateFunction: Function) {
            this.updateEvents.push(updateFunction);
        }

        /**
         * Add on start function, which will be called at start time;
         * @param  {Function} updateFunction
         */
        public registStart(updateFunction: Function) {
            this.startEvents.push(updateFunction);
        }

        /**
         * Start Animating object by keep calling update per frame
         */
        public start() {
            for (let event of this.startEvents) {
                event();
            }
        }

        /**
         * Update object status after next delta time
         * @param  {number} dt delta time
         */
        public update(dt: number) {
            for (let event of this.updateEvents) {
                event(dt);
            }
            for (let child of this.children) {
                child.update(dt);
            }
        }

        /**
         * Translate object by the given vector
         * @param  {Vec3Array} delta vector to translate by
         */
        public translate(delta: Vec3Array) {
            console.assert(delta instanceof Array && delta.length === 3, "invalid delta translate");
            this.localPosition = vec3.add(this.localPosition, vec3.clone(this.localPosition), delta);
        }

        /**
         * Rotates specific angle about X axis
         * @param  {number} angle angle (in radians) to rotate
         */
        public rotateX(angle: number) {
            this.localRotation = quat.rotateX(this.localRotation, quat.clone(this.localRotation), angle);
        }

        /**
         * Rotates specific angle about Y axis
         * @param  {number} angle angle (in radians) to rotate
         */
        public rotateY(angle: number) {
            this.localRotation = quat.rotateY(this.localRotation, quat.clone(this.localRotation), angle);
        }

        /**
         * Rotates specific angle about Z axis
         * @param  {number} angle angle (in radians) to rotate
         */
        public rotateZ(angle: number) {
            this.localRotation = quat.rotateY(this.localRotation, quat.clone(this.localRotation), angle);
        }

        protected genOtherMatrixs() {
            mat4.invert(this.objectToWorldMatrix, this.matrix);
        }

        private composeFromLocalMatrix() {
            mat4.fromRotationTranslationScale(
                this.localMatrix,
                this.localRotation,
                this.localPosition,
                this.localScaling
            );
            if (!!this._parent) {
                mat4.mul(this._matrix, this._parent.matrix, this.localMatrix);
            } else {
                this._matrix = mat4.clone(this._localMatrix);
            }
            this.genOtherMatrixs();
        }

        private composeFromGlobalMatrix() {
            mat4.fromRotationTranslationScale(
                this._matrix,
                this.rotation,
                this.position,
                this.scaling
            );
            this.genOtherMatrixs();
            if (!!this._parent) {
                mat4.mul(this._localMatrix, this._parent.objectToWorldMatrix, this.matrix);
            } else {
                this._localMatrix = mat4.clone(this._matrix);
            }
        }

        private applyToChildren() {
            for (let child of this.children) {
                child.setTransformFromParent();
            }
        }
    }
}
