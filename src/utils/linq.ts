/**
 * LinQ to TypeScript
 *
 * Documentation from LinQ .NET specification (https://msdn.microsoft.com/en-us/library/system.linq.enumerable.aspx)
 *
 * Created by Flavio Corpa (@kutyel)
 * Copyright © 2016 Flavio Corpa. All rights reserved.
 *
 */
export class List<T> {

    public static create<T>(elements: T[] = []): List<T> {
        if (!elements)
            elements = [];

        return new List<T>(elements);
    }

    protected _elements: T[];

    /**
     * Defaults the elements of the list
     */
    constructor(elements: T[] = []) {
        this._elements = elements;
    }

    /**
     * Adds an object to the end of the List<T>.
     */
    public add(element: T): void {
        this._elements.push(element);
    }

    /**
     * Adds the elements of the specified collection to the end of the List<T>.
     */
    public addRange(elements: T[]): void {
        this._elements.push(...elements);
    }

    /**
     * Applies an accumulator function over a sequence.
     */
    public aggregate<U>(accumulator: (accum: U, value?: T, index?: number, list?: T[]) => any, initialValue?: U): any {
        return this._elements.reduce(accumulator, initialValue);
    }

    /**
     * Determines whether all elements of a sequence satisfy a condition.
     */
    public all(predicate: (value?: T, index?: number, list?: T[]) => boolean): boolean {
        return this._elements.every(predicate);
    }

    /**
     * Determines whether a sequence contains any elements.
     */
    public any(): boolean;
    public any(predicate: (value?: T, index?: number, list?: T[]) => boolean): boolean;
    public any(predicate?: (value?: T, index?: number, list?: T[]) => boolean): boolean {
        return predicate ? this._elements.some(predicate) : this._elements.length > 0;
    }

    /**
     * Computes the average of a sequence of number values that are obtained by invoking
     * a transform function on each element of the input sequence.
     */
    public average(): number;
    public average(transform: (value?: T, index?: number, list?: T[]) => any): number;
    public average(transform?: (value?: T, index?: number, list?: T[]) => any): number {
        return this.sum(transform) / this.count(transform);
    }

    /**
     * Concatenates two sequences.
     */
    public concat(list: List<T>): List<T> {
        return new List<T>(this._elements.concat(list.toArray()));
    }

    /**
     * Determines whether an element is in the List<T>.
     */
    public contains(element: T): boolean {
        return this._elements.some(x => x === element);
    }

    /**
     * Returns the number of elements in a sequence.
     */
    public count(): number;
    public count(predicate: (value?: T, index?: number, list?: T[]) => boolean): number;
    public count(predicate?: (value?: T, index?: number, list?: T[]) => boolean): number {
        return predicate ? this.where(predicate).count() : this._elements.length;
    }

    /**
     * Returns the elements of the specified sequence or the type parameter's default value
     * in a singleton collection if the sequence is empty.
     */
    public defaultIfEmpty(defaultValue?: T): List<T> {
        return this.count() ? this : new List<T>([defaultValue]);
    }

    /**
     * Returns distinct elements from a sequence by using the default equality comparer to compare values.
     */
    public distinct(): List<T> {
        return this.where((value, index, iter) => iter.indexOf(value) === index);
    }

    /**
     * Returns distinct elements from a sequence according to specified key selector.
     */
    public distinctBy(keySelector: (key: T) => any): List<T> {
        const groups = this.groupBy(keySelector, obj => obj);
        const results = new List<T>();
        for (let index in groups) {
            if (groups.hasOwnProperty(index)) {
                results.add(groups[index][0]);
            }
        }
        return results;
    }

    /**
     * Returns the element at a specified index in a sequence.
     */
    public elementAt(index: number): T {
        if (index < this.count()) {
            return this._elements[index];
        } else {
            const MSG = 'ArgumentOutOfRangeException: index is less than 0 or greater than or equal to the number of elements in source.';
            throw new Error(MSG);
        }
    }

    /**
     * Returns the element at a specified index in a sequence or a default value if the index is out of range.
     */
    public elementAtOrDefault(index: number): T {
        return this.elementAt(index) || undefined;
    }

    /**
     * Produces the set difference of two sequences by using the default equality comparer to compare values.
     */
    public except(source: List<T>): List<T> {
        return this.where(x => !source.contains(x));
    }

    /**
     * Returns the first element of a sequence.
     */
    public first(): T;
    public first(predicate: (value?: T, index?: number, list?: T[]) => boolean): T;
    public first(predicate?: (value?: T, index?: number, list?: T[]) => boolean): T {
        if (this.count()) {
            return predicate ? this.where(predicate).first() : this._elements[0];
        } else {
            throw new Error('InvalidOperationException: The source sequence is empty.');
        }
    }

    /**
     * Returns the first element of a sequence, or a default value if the sequence contains no elements.
     */
    public firstOrDefault(): T;
    public firstOrDefault(predicate: (value?: T, index?: number, list?: T[]) => boolean): T;
    public firstOrDefault(predicate?: (value?: T, index?: number, list?: T[]) => boolean): T {
        return this.count(predicate) ? this.first(predicate) : undefined;
    }

    /**
     * Performs the specified action on each element of the List<T>.
     */
    public forEach(action: (value?: T, index?: number, list?: T[]) => any): void {
        return this._elements.forEach(action);
    }

    /**
     * Groups the elements of a sequence according to a specified key selector function.
     */
    public groupBy(grouper: (key: T) => any, mapper: (element: T) => any): any {
        return this.aggregate
            ((ac, v) => ((<any>ac)[grouper(v)] ? (<any>ac)[grouper(v)].push(mapper(v)) : (<any>ac)[grouper(v)] = [mapper(v)], ac), {});
    }

    /**
     * Correlates the elements of two sequences based on equality of keys and groups the results.
     * The default equality comparer is used to compare keys.
     */
    public groupJoin<U>(list: List<U>, key1: (k: T) => any, key2: (k: U) => any, result: (first: T, second: List<U>) => any): List<any> {
        return this.select((x, y) => result(x, list.where(z => key1(x) === key2(z))));
    }

    /**
     * Returns the index of the first occurence of an element in the List.
     */
    public indexOf(element: T): number {
        return this._elements.indexOf(element);
    }

    /**
     * Inserts an element into the List<T> at the specified index.
     */
    public insert(index: number, element: T): void | Error {
        if (index < 0 || index > this._elements.length) {
            throw new Error('Index is out of range.');
        }

        this._elements.splice(index, 0, element);
    }

    /**
     * Produces the set intersection of two sequences by using the default equality comparer to compare values.
     */
    public intersect(source: List<T>): List<T> {
        return this.where(x => source.contains(x));
    }

    /**
     * Correlates the elements of two sequences based on matching keys. The default equality comparer is used to compare keys.
     */
    public join<U>(list: List<U>, key1: (key: T) => any, key2: (key: U) => any, result: (first: T, second: U) => any): List<any> {
        return this.selectMany(x => list.where(y => key2(y) === key1(x)).select(z => result(x, z)));
    }

    /**
     * Returns the last element of a sequence.
     */
    public last(): T;
    public last(predicate: (value?: T, index?: number, list?: T[]) => boolean): T;
    public last(predicate?: (value?: T, index?: number, list?: T[]) => boolean): T {
        if (this.count()) {
            return predicate ? this.where(predicate).last() : this._elements[this.count() - 1];
        } else {
            throw Error('InvalidOperationException: The source sequence is empty.');
        }
    }

    /**
     * Returns the last element of a sequence, or a default value if the sequence contains no elements.
     */
    public lastOrDefault(): T;
    public lastOrDefault(predicate: (value?: T, index?: number, list?: T[]) => boolean): T;
    public lastOrDefault(predicate?: (value?: T, index?: number, list?: T[]) => boolean): T {
        return this.count(predicate) ? this.last(predicate) : undefined;
    }

    /**
     * Returns the maximum value in a generic sequence.
     */
    public max(): T {
        return this.aggregate((x, y) => x > y ? x : y);
    }

    /**
     * Returns the minimum value in a generic sequence.
     */
    public min(): T {
        return this.aggregate((x, y) => x < y ? x : y);
    }

    /**
     * Sorts the elements of a sequence in ascending order according to a key.
     */
    public orderBy(keySelector: (key: T) => any): List<T> {
        return new OrderedList<T>(this._elements, ComparerHelper.comparerForKey(keySelector, false));
    }

    /**
     * Sorts the elements of a sequence in descending order according to a key.
     */
    public orderByDescending(keySelector: (key: T) => any): List<T> {
        return new OrderedList<T>(this._elements, ComparerHelper.comparerForKey(keySelector, true));
    }

    /**
     * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.
     */
    public thenBy(keySelector: (key: T) => any): List<T> {
        return this.orderBy(keySelector);
    }

    /**
     * Performs a subsequent ordering of the elements in a sequence in descending order, according to a key.
     */
    public thenByDescending(keySelector: (key: T) => any): List<T> {
        return this.orderByDescending(keySelector);
    }

    /**
     * Removes the first occurrence of a specific object from the List<T>.
     */
    public remove(element: T): boolean {
        return this.indexOf(element) !== -1 ? (this.removeAt(this.indexOf(element)), true) : false;
    }

    /**
     * Removes all the elements that match the conditions defined by the specified predicate.
     */
    public removeAll(predicate: (value?: T, index?: number, list?: T[]) => boolean): List<T> {
        return this.where(this._negate(predicate));
    }

    /**
     * Removes the element at the specified index of the List<T>.
     */
    public removeAt(index: number): void {
        this._elements.splice(index, 1);
    }

    /**
     * Reverses the order of the elements in the entire List<T>.
     */
    public reverse(): List<T> {
        return new List<T>(this._elements.reverse());
    }

    /**
     * Projects each element of a sequence into a new form.
     */
    public select<TOut>(mapper: (value?: T, index?: number, list?: T[]) => TOut): List<TOut> {
        return new List<any>(this._elements.map(mapper));
    }

    /**
     * Projects each element of a sequence to a List<any> and flattens the resulting sequences into one sequence.
     */
    public selectMany<TOut extends List<any>>(mapper: (value?: T, index?: number, list?: T[]) => TOut): TOut {
        return this.aggregate((ac, v, i) => (ac.addRange(this.select(mapper).elementAt(i).toArray()), ac), new List<TOut>());
    }

    /**
     * Determines whether two sequences are equal by comparing the elements by using the default equality comparer for their type.
     */
    public sequenceEqual(list: List<T>): boolean {
        return !!this._elements.reduce((x, y, z) => list._elements[z] === y ? x : undefined);
    }

    /**
     * Returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence.
     */
    public single(): T {
        if (this.count() !== 1) {
            throw new Error('The collection does not contain exactly one element.');
        } else {
            return this.first();
        }
    }

    /**
     * Returns the only element of a sequence, or a default value if the sequence is empty;
     * this method throws an exception if there is more than one element in the sequence.
     */
    public singleOrDefault(): T {
        return this.count() ? this.single() : undefined;
    }

    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     */
    public skip(amount: number): List<T> {
        return new List<T>(this._elements.slice(Math.max(0, amount)));
    }

    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     */
    public skipWhile(predicate: (value?: T, index?: number, list?: T[]) => boolean): List<T> {
        return this.skip(this.aggregate((ac, val) => predicate(this.elementAt(ac)) ? ++ac : ac, 0));
    }

    /**
     * Computes the sum of the sequence of number values that are obtained by invoking
     * a transform function on each element of the input sequence.
     */
    public sum(): number;
    public sum(transform: (value?: T, index?: number, list?: T[]) => number): number;
    public sum(transform?: (value?: T, index?: number, list?: T[]) => number): number {
        return transform ? this.select(transform).sum() : this.aggregate((ac, v) => ac += (+v), 0);
    }

    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     */
    public take(amount: number): List<T> {
        return new List<T>(this._elements.slice(0, Math.max(0, amount)));
    }

    /**
     * Returns elements from a sequence as long as a specified condition is true.
     */
    public takeWhile(predicate: (value?: T, index?: number, list?: T[]) => boolean): List<T> {
        return this.take(this.aggregate((ac, val) => predicate(this.elementAt(ac)) ? ++ac : ac, 0));
    }

    /**
     * Copies the elements of the List<T> to a new array.
     */
    public toArray(): T[] {
        return this._elements;
    }

    /**
     * Creates a Dictionary<TKey, TValue> from a List<T> according to a specified key selector function.
     */
    public toDictionary<TKey, TValue>(key: (key: T) => TKey, value?: (value: T) => TValue): Object {
        return this.aggregate((o, v, i) => ((<any>o)[this.select(key).elementAt(i).toString()] = value ? this.select(value).elementAt(i) : v, o), {});
    }

    /**
     * Creates a List<T> from an Enumerable.List<T>.
     */
    public toList(): List<T> {
        return this;
    }

    /**
     * Creates a Lookup<TKey, TElement> from an IEnumerable<T> according to specified key selector and element selector functions.
     */
    public toLookup(keySelector: (key: T) => any, elementSelector: (element: T) => any): any {
        return this.groupBy(keySelector, elementSelector);
    }

    /**
     * Produces the set union of two sequences by using the default equality comparer.
     */
    public union(list: List<T>): List<T> {
        return this.concat(list).distinct();
    }

    /**
     * Filters a sequence of values based on a predicate.
     */
    public where(predicate: (value?: T, index?: number, list?: T[]) => boolean): List<T> {
        return new List<T>(this._elements.filter(predicate));
    }

    /**
     * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
     */
    public zip<U, TOut>(list: List<U>, result: (first: T, second: U) => TOut): List<TOut> {
        return list.count() < this.count() ? list.select((x, y) => result(this.elementAt(y), x)) :
            this.select((x, y) => result(x, list.elementAt(y)));
    }

    /**
     * Creates a function that negates the result of the predicate
     */
    private _negate(predicate: (value?: T, index?: number, list?: T[]) => boolean): () => any {
        return function (): any {
            return !predicate.apply(this, arguments);
        };
    }
}

class ComparerHelper {
    public static comparerForKey<T>(_keySelector: (key: T) => any, descending?: boolean): (a: T, b: T) => number {
        return (a: T, b: T) => {
            return ComparerHelper.compare(a, b, _keySelector, descending);
        };
    }

    public static compare<T>(a: T, b: T, _keySelector: (key: T) => any, descending?: boolean): number {
        let sortKeyA = _keySelector(a);
        let sortKeyB = _keySelector(b);
        if (sortKeyA > sortKeyB) {
            if (!descending) {
                return 1;
            } else {
                return -1;
            }
        } else if (sortKeyA < sortKeyB) {
            if (!descending) {
                return -1;
            } else {
                return 1;
            }
        } else {
            return 0;
        }
    }

    public static ComposeComparers<T>(
        previousComparer: (a: T, b: T) => number,
        currentComparer: (a: T, b: T) => number
    ): (a: T, b: T) => number {
        return (a: T, b: T) => {
            let resultOfPreviousComparer = previousComparer(a, b);
            if (!resultOfPreviousComparer) {
                return currentComparer(a, b);
            } else {
                return resultOfPreviousComparer;
            }
        };
    }
}

/**
 * Represents a sorted sequence. The methods of this class are implemented by using deferred execution.
 * The immediate return value is an object that stores all the information that is required to perform the action.
 * The query represented by this method is not executed until the object is enumerated either by
 * calling its ToDictionary, toLookup, ToList or toArray methods
 */
class OrderedList<T> extends List<T> {
    constructor(elements: T[], private _comparer: (a: T, b: T) => number) {
        super(elements);
        this._elements.sort(this._comparer);
    }

    /**
     * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.
     * @override
     */
    public thenBy(keySelector: (key: T) => any): List<T> {
        return new OrderedList(
            this._elements,
            ComparerHelper.ComposeComparers(this._comparer, ComparerHelper.comparerForKey(keySelector, false))
        );
    }

    /**
     * Performs a subsequent ordering of the elements in a sequence in descending order, according to a key.
     * @override
     */
    public thenByDescending(keySelector: (key: T) => any): List<T> {
        return new OrderedList(
            this._elements,
            ComparerHelper.ComposeComparers(this._comparer, ComparerHelper.comparerForKey(keySelector, true))
        );
    }
}

export class Enumerable {

    /**
     * Generates a sequence of integral numbers within a specified range.
     */
    public static range(start: number, count: number): List<number> {
        let result = new List<number>(); while (count--) { result.add(start++); } return result;
    }

    /**
     * Generates a sequence that contains one repeated value.
     */
    public static repeat<T>(element: T, count: number): List<T> {
        let result = new List<T>(); while (count--) { result.add(element); } return result;
    }
}
